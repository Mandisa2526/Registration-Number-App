export default function Query(db){
    
    async function insertRegNum(regNum){
        
        await db.none(`INSERT INTO registration(registration_number) VALUES ('${regNum}')`);
    }

    return{
       insertRegNum,
    }
}