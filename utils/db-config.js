//Pool for all the user access (Ankith's DB)
const { Pool } = require('pg');
console.log('inside db config ');
const config = {
	host: 'localhost',
	port: '5432',
	database: 'postgres',
	user: 'postgres',
	password: '9902'
};
const pool = new Pool(config);

// const config =
// 	"postgres://vcgfznklwqbvwf:913359968a36ee943a216cec0d7d4a8d1f82f03c5b7af8b0cca43745b21c7943@ec2-54-225-173-42.compute-1.amazonaws.com:5432/d6k5j4k7j0vn8m";

// const pool = new Pool({ connectionString: config });


module.exports = pool;
