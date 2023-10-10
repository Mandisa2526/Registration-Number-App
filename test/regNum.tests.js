import assert from "assert";
import pgPromise from 'pg-promise';
import Query from '../services/queryReg.js';
import RegistrationNumberFact from "../js/registrationNum.js";
import { log } from "console";


const pgp = pgPromise();

const connectionString = "postgres://lgcqntdq:P4UKjMZH_2xNewSFy46RaG55YEmwDqsJ@mahmud.db.elephantsql.com/lgcqntdq?ssl=true";
const db = pgp(connectionString);

let database = Query(db);

describe('Registration number factory function code test', function () {

    it('should be able  to return an error message when the registration number exists', async function () {
        let registrationNumberObject = RegistrationNumberFact();

        registrationNumberObject.addRegistration("CJ 123456");
        registrationNumberObject.addRegistration("CJ 123456");

        let result = registrationNumberObject.getError();

        assert.equal('Registration number exists!' == '', result);

    });
    it("should be able to return error message when the registration number is not entered", async function () {
        let registrationNumberObject = RegistrationNumberFact();

        registrationNumberObject.addRegistration("CJ 123456");
        registrationNumberObject.addRegistration("CJ 123456");

        let results = registrationNumberObject.getError();

        assert.equal('Enter registration number!' == '', results);
    });

});
describe('the Registration Number App database function/Code', function () {

    beforeEach(async function () {
        try {
            this.timeout(10000);
            // clean the tables before each test run
            await db.none("TRUNCATE TABLE towns RESTART IDENTITY CASCADE;");
            await db.none("INSERT INTO towns(id, towns_name, start_town) VALUES(1, 'Cape Town', 'CA')");
            await db.none("INSERT INTO towns(id, towns_name,start_town) VALUES(2, ' Queenstown','CH')");
            await db.none("INSERT INTO towns(id, towns_name,start_town) VALUES(3, 'Paarl ','CJ')");
    
        } catch (err) {
            console.log(err);
            throw err;
        }
    });

    this.timeout(10000);
    it("should allow adding registration numbers", async function () {
        let database = Query(db);

        await database.insertRegNum("CJ 123456", 3);

        let result1 = await database.getRegistrations("All");

        assert.equal(1, result1.length);
    });

    it("should able to insert registration numbers for 3  available towns", async function () {
        this.timeout(10000);
        let database = Query(db);

        await database.insertRegNum("CA 466 789");
        await database.insertRegNum("CA 121456");
        await database.insertRegNum("CJ 123-466");

        let result = await database.getRegistrations();

        assert.equal(3, result.length);

    });

    it('should test reset button', async function () {
        this.timeout(10000); // Set a longer timeout for this test

        let database = Query(db);
        // Insert some test data before testing reset
        await database.insertRegNum('CA 466 789', 1);
        await database.insertRegNum('CF 121456', 2);

        // Reset the database 
        await database.deleteAllUsers();

        const registrations = await database.getRegistrations("All");
        assert.equal(registrations.length, 0);
    });


    it("should be able to clear the registration data", async function () {
        await database.insertRegNum("CA 456 789");
        await database.insertRegNum("CF 123456");
        await database.insertRegNum("CJ 123 456");

        await database.deleteAllUsers();

        let result = await database.getRegistrations("All");

        assert.equal(0, result.length);
    });
    after(function () {
        db.$pool.end
    });
});