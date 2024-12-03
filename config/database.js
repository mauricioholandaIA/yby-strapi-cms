const path = require("path");

module.exports = () => {
  const client = "postgres";

  const connections = {
    postgres: {
      connection: {
        connectionString: "terraform-20241129052344326800000001.cxo6swgqm3n3.us-east-1.rds.amazonaws.com",
        host: "terraform-20241129052344326800000001.cxo6swgqm3n3.us-east-1.rds.amazonaws.com",
        port: 5432,
        database: "yby_db_dev",
        user: "postgresadmin",
        password: "JDu384nf8294h",
        ssl: false && {
          key: undefined,
          cert: undefined,
          ca: undefined,
          capath: undefined,
          cipher: undefined,
          rejectUnauthorized: true,
        },
        schema: "public",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: 60000,
    },
  };
};
