import msSqlDriver from 'mssql';
import { DataSource, DataSourceOptions } from 'typeorm';

const msSqlDataSourceOptions: DataSourceOptions = {
  type: 'mssql',
  driver: msSqlDriver, // NOTE: this is key, langchainjs has a weird issue working with the ms-sql driver in the package, replacing driver
  host: 'localhost',
  port: 1433,
  username: 'sa',
  password: 'admin@123',
  database: 'mydb',
  schema: 'dbo',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const msqlDataSource: DataSource = new DataSource(msSqlDataSourceOptions);

const giaDataSourceOptions: DataSourceOptions = {
  type: 'mssql',
  driver: msSqlDriver, // NOTE: this is key, langchainjs has a weird issue working with the ms-sql driver in the package, replacing driver
  host: 'my-server-name',
  port: 1433,
  username: 'service',
  password: 'my-secret-password',
  database: 'my-db-name',
  schema: 'scope',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export { giaDataSourceOptions, msqlDataSource, msSqlDataSourceOptions };
