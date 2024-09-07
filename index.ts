import { SqlDatabase } from "langchain/sql_db";
import { createSqlQueryChain, SqlDatabaseChain } from "langchain/chains/sql_db";
import dotenv from "dotenv";
import { DataSourceOptions, DataSource } from "typeorm";
import msSqlDriver from "mssql";
import { OpenAI } from "@langchain/openai";
const { ConnectionPool } = msSqlDriver;
dotenv.config();

async function main() {
  const sqlDataSource: DataSourceOptions = {
    type: "mssql",
    driver: msSqlDriver,
    host: "localhost",
    port: 1433,
    username: "sa",
    password: "admin@123",
    database: "mydb",
    schema: "dbo",
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };

  const db = new ConnectionPool(
    "Server=localhost,1433;Database=mydb;User Id=sa;Password=admin@123;trustServerCertificate=true;"
  );
  await db.connect();

  console.log(
    (await db.query("select * from dbo.Movies")).recordset.map(
      (a: { Name: string; Year: number }) => `${a.Name} (${a.Year})`
    )
  );

  const ds: DataSource = new DataSource(sqlDataSource);

  const langChaindb = await SqlDatabase.fromOptionsParams({
    appDataSourceOptions: sqlDataSource,
  });

  const tableInfo: string = await langChaindb.getTableInfo();
  console.log(tableInfo);

  console.log(langChaindb.allTables.map((a: any) => a.tableName));

  const openaiLlm = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
  });

  const sqlDbChain = new SqlDatabaseChain({
    llm: openaiLlm,
    database: langChaindb,
  });

  const result = await sqlDbChain.invoke({
    query: "How many movies are there?",
  });
  console.log(result);
}

main();
