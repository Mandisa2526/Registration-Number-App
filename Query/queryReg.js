export default function Query(db){
    
    async function insertRegNum(regNum) {
        let town = await getTownId(regNum);
        await db.none(`INSERT INTO registration(registration_number,towns_id) VALUES ('${regNum}','${town.id}')`);
    }

    function getTownId(regNum) {        
        let townCode = regNum.substring(0,2);
        return db.oneOrNone(`SELECT id FROM towns WHERE start_town = '${townCode}'`);
    }

    function getRegistrations() {
        return db.any('SELECT registration_number from registration');
    }
    return{
       insertRegNum,
       getTownId,
       getRegistrations,
    }
}