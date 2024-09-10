// import * as colors from 'colors';
import { RunnableConfig } from '@langchain/core/runnables';
import colors from 'colors';
import { SqlDatabaseChain } from 'langchain/chains/sql_db';
import { SqlDatabase } from 'langchain/sql_db';
import * as readline from 'readline-sync';
import { chatOpenAi } from './src/config/open-ai.js';
import msSqlDataSourceOptions from './src/mssql-driver/sql-driver.js';
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

  // const sqlQueryGeneratorChain = RunnableSequence.from([
  //   RunnablePassthrough.assign({
  //     schema: () => tableInfo
  //   }),
  //   chatOpenAi.generatePrompt,
  //   chatOpenAi.bind({ stop: ['\n SQLResult:'] }),
  //   new StringOutputParser()
  // ]);

  // const fullChain = RunnableSequence.from([
  //   RunnablePassthrough.assign({
  //     query: sqlQueryGeneratorChain
  //   }),
  //   {
  //     schema: async () => tableInfo,
  //     question: input => input.question,
  //     query: input => input.query,
  //     response: input => langChaindb.run(input.query)
  //   },
  //   chatOpenAi
  // ]);

  // const chatHistory: any[] = [];

  console.log(colors.bold.green('You can now ask questions using natural language to the bot'));

  while (true) {
    try {
      // const messages = chatHistory.map(([role, content]) => ({ role, content }));

      const userInput = readline.question(colors.yellow('You: '));

      let output;
      if (userInput.toLowerCase() === 'exit') {
        output = 'Goodbye! If you have any more questions in the future, feel free to ask.';
        console.log(colors.green('Bot: ') + output);
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
      // console.error(colors.bgRed.white(JSON.stringify(error)));
    }
  }
}

main(false);
