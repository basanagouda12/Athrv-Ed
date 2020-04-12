//Pool of all the athrev-ed db accesses
console.log("inside dg - config 1");
const { Pool } = require("pg");

const config = {
	host: 'localhost',
	port: '5432',
	database: 'postgres',
	user: 'postgres',
	password: '9902'
};
const pool = new Pool(config);

// const config =
//   "postgres://qfwsljvlfcnuva:bce39f8598aa1219bf21fb1520ed4675ed01895b87d9621fb10b84f400f26c00@ec2-174-129-255-72.compute-1.amazonaws.com:5432/db7hp8mntuj13l";
// const pool = new Pool({ connectionString: config });


module.exports = pool;
