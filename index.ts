/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableConfig, RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import colors from 'colors';
import { createSqlQueryChain, SqlDatabaseChain } from 'langchain/chains/sql_db';
import { SqlDatabase } from 'langchain/sql_db';
import * as readline from 'readline-sync';
import { z } from 'zod';
import { chatOpenAi } from './src/config/open-ai.js';
import msSqlDataSourceOptions, { giaDataSourceOptions } from './src/mssql-driver/sql-driver.js';
import { testDbConnection } from './src/utils/connection-tests.js';

async function main(showDebug: boolean = false) {
  console.log(colors.bold.green('Chatbot for SQL RAG'));

  console.log(colors.bgWhite.bold.cyan('Configuring your bot'));
  await testDbConnection(showDebug);

  const langChaindb = await SqlDatabase.fromOptionsParams({
    appDataSourceOptions: msSqlDataSourceOptions
  });

  const tableInfo: string = await langChaindb.getTableInfo();
  if (showDebug || !Boolean(tableInfo)) {
    console.log(langChaindb.allTables.map((a: any) => a.tableName));
    console.log(colors.bgWhite.gray('LangChaingDB connection check: ' + Boolean(tableInfo) ? 'successful' : 'fail'));
  }

  const sqlDbChain = new SqlDatabaseChain({
    llm: chatOpenAi,
    database: langChaindb,
    verbose: false
  });

  // const chatHistory: any[] = [];

  console.log(colors.bold.green('You can now ask questions using natural language to the bot'));

  while (true) {
    try {
      const userInput = readline.question(colors.yellow('You: '));

      let output;
      if (userInput.toLowerCase() === 'exit') {
        output = 'Goodbye! If you have any more questions in the future, feel free to ask.';
        console.log(colors.green('Bot: ') + JSON.stringify(output));
        console.log();
        process.exit();
      }

      output = (
        await sqlDbChain.invoke({
          query: userInput,
          options: { timeout: 30_000 } as RunnableConfig
        })
      )?.result;

      console.log(colors.green('Bot: ') + output);
    } catch (error) {
      console.error(colors.bgRed.white(JSON.stringify(error)));
    }
  }
}

async function mainLargeDatabase(showDebug: boolean = false) {
  console.log(colors.bold.green('Chatbot for SQL RAG'));

  console.log(colors.bgWhite.bold.cyan('Configuring your bot'));
  await testDbConnection(showDebug);

  const dbToQuery = await SqlDatabase.fromOptionsParams({
    appDataSourceOptions: msSqlDataSourceOptions
  });

  const Table = z.object({
    names: z.array(z.string()).describe('Names of tables in SQL database')
  });

  const tableNames = dbToQuery.allTables.map(t => t.tableName).join('\n');

  const system = `Return the names of ALL the SQL tables that MIGHT be relevant to the user question.
The tables are:

${tableNames}

Remember to include ALL POTENTIALLY RELEVANT tables, even if you're not sure that they're needed.`;

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', system],
    ['human', '{input}']
  ]);
  const tableChain = prompt.pipe(chatOpenAi.withStructuredOutput(Table));

  const sqlQueryChain = await createSqlQueryChain({
    llm: chatOpenAi,
    db: dbToQuery,
    dialect: 'mssql'
  });

  const tableGen2Chain = RunnableSequence.from([
    {
      input: (i: { question: string }) => i.question
    },
    tableChain
  ]);

  const fullDbChain = RunnablePassthrough.assign({
    tableNamesToUse: tableGen2Chain
  }).pipe(sqlQueryChain);

  console.log(colors.bold.green('You can now ask questions using natural language to the bot'));

  while (true) {
    try {
      const userInput = readline.question(colors.yellow('You: '));

      let output;
      if (userInput.toLowerCase() === 'exit') {
        output = 'Goodbye! If you have any more questions in the future, feel free to ask.';
        console.log(colors.green('Bot: ') + output);
        console.log();
        process.exit();
      }

      if (showDebug) {
        console.log(
          await tableChain.invoke({
            input: userInput
          })
        );
      }

      output = await fullDbChain.invoke({
        question: userInput
      });

      console.log(colors.gray('OpenAI: ') + output);
      console.log(colors.green('Bot: ') + (await dbToQuery.run(output)));
    } catch (error: any) {
      console.error(colors.bgRed.white(error));
    }
  }
}

async function mainQueryGia(showDebug: boolean = false) {
  console.log(colors.bold.green('Chatbot for SQL RAG'));

  console.log(colors.bgWhite.bold.cyan('Configuring your bot'));

  const giaDb = await SqlDatabase.fromOptionsParams({
    appDataSourceOptions: giaDataSourceOptions
  });

  const Table = z.object({
    names: z.array(z.string()).describe('Names of tables in SQL database')
  });

  const llm = chatOpenAi;

  const categoryPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `Return the names of the SQL tables that are relevant to the user question.
  The tables are:
  
  Assessment
  Scope`
    ],
    ['human', '{input}']
  ]);

  const getTables = (categories: z.infer<typeof Table>): string[] => {
    let tables: string[] = [];
    for (const category of categories.names) {
      if (category === 'Scope') {
        tables = tables.concat(['Alumni', 'AuditClient', 'ODSSI']);
      } else if (category === 'Assessment') {
        tables = tables.concat(['Assessment']);
      }
    }
    return tables;
  };

  const categoryChain = categoryPrompt
    .pipe(llm.withStructuredOutput(Table)) // Stage 1 uses category prompt to get categories
    .pipe(getTables); // Stage 2 pipeline converts categories to table names

   const tableChain = RunnableSequence.from([
     {
       input: (i: { question: string }) => i.question
     },
     categoryChain
   ]);

  const sqlQueryChain = await createSqlQueryChain({
    llm: llm,
    db: giaDb,
    dialect: 'mssql'
  });

  const fullDbChain = RunnablePassthrough.assign({
    tableNamesToUse: tableChain
  }).pipe(sqlQueryChain);

  console.log(colors.bold.green('You can now ask questions using natural language to the bot'));

  while (true) {
    try {
      const userInput = readline.question(colors.yellow('You: '));

      let output;
      if (userInput.toLowerCase() === 'exit') {
        output = 'Goodbye! If you have any more questions in the future, feel free to ask.';
        console.log(colors.green('Bot: ') + output);
        console.log();
        process.exit();
      }

      if (showDebug) {
        console.log(await categoryChain.invoke({ input: userInput }));
      }

      output = await fullDbChain.invoke({
        question: userInput
      });

      console.log(colors.gray('OpenAI: ' + output));
      console.log(colors.green('Bot: ') + (await giaDb.run(output)));
    } catch (error: any) {
      console.error(colors.bgRed.white(error));
    }
  }
}

// main(false);
// mainLargeDatabase();
mainQueryGia(true);
