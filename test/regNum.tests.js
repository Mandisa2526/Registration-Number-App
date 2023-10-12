import assert from "assert";
import pgPromise from 'pg-promise';
import Query from '../services/queryReg.js';
import RegistrationNumberFact from "../js/registrationNum.js";

const pgp = pgPromise();

const connectionString = "postgres://lgcqntdq:P4UKjMZH_2xNewSFy46RaG55YEmwDqsJ@mahmud.db.elephantsql.com/lgcqntdq?ssl=true";
const db = pgp(connectionString);

let query = Query(db);

describe('Registration number factory function code test', function () {
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

    it('should be able  to return an error message when the registration number exists', async function () {
        this.timeout(10000);
        let registrationNumberObject = RegistrationNumberFact(query);
        await registrationNumberObject.addRegistration("CJ 123456");
        await registrationNumberObject.addRegistration("CJ 123456");

        let result = registrationNumberObject.getError();

        assert.equal( 'CJ 123456 already exists! Please enter a new registration number.', result);

    });

    it('should be able  to add registration numbers in the text box and display them in the home page', async function () {
        this.timeout(10000);

        let registrationNumberObject = RegistrationNumberFact(query);

        await registrationNumberObject.addRegistration("CJ 123456");
 
        let result = await registrationNumberObject.getAllRegistration();

        assert.equal('CJ 123456', result);

    });

    it("should be able to return error message when the registration number is not entered", async function () {
        let registrationNumberObject = RegistrationNumberFact(query);
        await registrationNumberObject.addRegistration("");
        let results = registrationNumberObject.getError();
        assert.equal( 'Please enter a registration number!', results);
    });

    it("should be able to return error message when the town filtered is not available", async function () {
        this.timeout(10000);
        let registrationNumberObject = RegistrationNumberFact(query);

        await registrationNumberObject.addRegistration("CJ 123456");

        await registrationNumberObject.getRegistrationForTown('CH');

        assert.equal('Town was not added!', registrationNumberObject.getError());

        
    });

    it('should be able to return an error message when the name is max lenght is exceeded ' , async function(){
        let registrationNumberObject = RegistrationNumberFact(query);
        await registrationNumberObject.addRegistration("CJ 123-4561");
        assert.equal('Maximum length exceeded!', registrationNumberObject.getError());     
    });

    it('should be able to return an error message when the name is min lenght is exceeded ' , async function(){
        this.timeout(10000);
        let registrationNumberObject = RegistrationNumberFact(query);

        await registrationNumberObject.addRegistration("CJ 123");

        assert.equal('Minimum length exceeded!', registrationNumberObject.getError());     
    });

    it("should be able to filter for a specific town selected", async function () {
        this.timeout(10000);
        let registrationNumberObject = RegistrationNumberFact(query);

        await registrationNumberObject.addRegistration("CJ 124-455");
        await registrationNumberObject.addRegistration("CA 123-455");
        await registrationNumberObject.addRegistration("CJ 22445");

        let results = await registrationNumberObject.getRegistrationForTown('CJ');

        assert.deepEqual([ 'CJ 124-455', 'CJ 22445' ], results);
    });

    it("should be able to return a success message when the data is cleared", async function () {
        this.timeout(10000);
        let registrationNumberObject = RegistrationNumberFact(query);

        await registrationNumberObject.addRegistration("CJ 123456");
        await registrationNumberObject.addRegistration("CA 123456");

        await registrationNumberObject.reset();

        let result = await registrationNumberObject.getSuccessMessage();

        assert.equal("Successfully Cleared", result);
    });

    after(function () {
        db.$pool.end
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

    it("should allow adding registration numbers", async function () {
        this.timeout(10000);
        await query.insertRegNum("CJ 123456");

        let result = await query.getRegistrations();

        assert.equal(1, result.length);
    });

    it("should able to insert registration numbers for 3  available towns", async function () {
        this.timeout(10000);
        await query.insertRegNum("CA 466789");
        await query.insertRegNum("CA 121456");
        await query.insertRegNum("CJ 123466");

        let result = await query.getRegistrations();

        assert.equal(3, result.length);

    });

    it('should test reset button', async function () {
        this.timeout(10000); // Set a longer timeout for this test
        await query.insertRegNum('CA 466789');
        await query.insertRegNum('CJ 121456');

        // Reset the query 
        await query.deleteAllUsers();

        const result = await query.getRegistrations();
        assert.equal(result.length, 0);
    });


    it("should be able to clear the registration data", async function () {
        this.timeout(10000);
        await query.insertRegNum("CA 123456");
        await query.insertRegNum("CH 123456");
        await query.insertRegNum("CJ 123456");

        await query.deleteAllUsers();

        let result = await query.getRegistrations();

        assert.equal(0, result.length);
    });
    after(function () {
        db.$pool.end
    });
});