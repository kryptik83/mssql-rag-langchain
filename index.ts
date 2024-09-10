import { SqlDatabaseChain } from 'langchain/chains/sql_db';
import { SqlDatabase } from 'langchain/sql_db';
import openAi from './src/config/open-ai.js';
import msSqlDataSourceOptions from './src/mssql-driver/sql-driver.js';
import { testDbConnection } from './src/utils/connection-tests.js';

async function main() {
  await testDbConnection();

  const langChaindb = await SqlDatabase.fromOptionsParams({
    appDataSourceOptions: msSqlDataSourceOptions
  });

  const tableInfo: string = await langChaindb.getTableInfo();
  console.log('LangChaingDB connection check', Boolean(tableInfo) ? 'successful' : 'fail');

  console.log(langChaindb.allTables.map((a: any) => a.tableName));

  const sqlDbChain = new SqlDatabaseChain({
    llm: openAi,
    database: langChaindb,
    verbose: false
  });

  const questions: string[] = ['How many movies are there?', 'What is the highest rated movie?'];
  const result = await sqlDbChain.invoke({
    query: questions[1]
  });
  // const result = await sqlDbChain.run("How many movies are there?");
  console.log(result?.result);
}

main();
