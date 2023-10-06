import assert from "assert";
import RegistrationNumberFact from '../js/registrationNum.js';
import pgPromise from 'pg-promise';
import Query from '../Query/queryReg.js'; 


const pgp = pgPromise();

const connectionString = "postgres://lgcqntdq:P4UKjMZH_2xNewSFy46RaG55YEmwDqsJ@mahmud.db.elephantsql.com/lgcqntdq?ssl=true";
const db = pgp(connectionString);

let database = Query(db);

describe('the Registration Number App database function/Code' , function(){

    this.timeout(10000);
    it("should allow adding registration numbers", async function (){
        await database.insertRegNum("CJ 123456",3);

        let result = await database.getRegistrations("All");

        assert.equal(1, result.length);
    });
   
    it("should able to insert registration numbers for 3  available towns", async function () {
        this.timeout(10000);
        let database = Query(db);

        await database.insertRegNum("CA 466 789",1);
        await database.insertRegNum("CF 121456",2);
        await database.insertRegNum("CJ 123-466",3);

        let result = await database.getRegistrations("All");

        assert.equal(3, result.length);

    });

    it('should test reset button', async function () {
        this.timeout(10000); // Set a longer timeout for this test

        let database =  Query(db);
        // Insert some test data before testing reset
        await database.insertRegNum('CA 466 789',1);
        await database.insertRegNum('CF 121456',2);
    
        // Reset the database 
        await database.deleteAllUsers();
    
        const registrations = await database.getRegistrations("All"); 
        assert.equal(registrations.length, 0);
    });


    it("should be able to clear the registration data", async function(){
        await database.insertRegNum("CA 456 789");
        await database.insertRegNum("CF 123456");
        await database.insertRegNum("CJ 123 456");

        await database.deleteAllUsers();

        let result = await database.getRegistrations("All");

        assert.equal(0,result.length);
    });


    after(function(){
        db.$pool.end
    });
});