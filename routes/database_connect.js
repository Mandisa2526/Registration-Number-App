import pgPromise from 'pg-promise';
import 'dotenv/config';

// Instantiate pg-promise
let pgp = pgPromise();

// which db connection to use
const cs = process.env.connectionString;

// Instaniate Database
const database = pgp(cs);

export default database