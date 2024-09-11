import msSqlDriver from 'mssql';
const { ConnectionPool } = msSqlDriver;

export const testDbConnection = async (showDebug: boolean = false): Promise<void> => {
  if (!showDebug) {
    return;
  }
  const db = new ConnectionPool('Server=localhost,1433;Database=mydb;User Id=sa;Password=admin@123;trustServerCertificate=true;');
  await db.connect();

  console.log((await db.query('select * from dbo.Movies')).recordset.map((a: { Name: string; Year: number }) => `${a.Name} (${a.Year})`));
};
