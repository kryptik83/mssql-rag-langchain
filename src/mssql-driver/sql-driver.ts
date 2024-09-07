import msSqlDriver from "mssql";
import { DataSourceOptions, DataSource } from "typeorm";

const msSqlDataSourceOptions: DataSourceOptions = {
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

export const msqlDataSource: DataSource = new DataSource(
  msSqlDataSourceOptions
);

export default msSqlDataSourceOptions;
