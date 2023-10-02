export default function Query(db){
    
    async function insertRegNum(regNum){
        
        await db.none(`INSERT INTO registration(registration_number) VALUES ('${regNum}')`);
    }
    async function selectNumbers(){
        let regNumbers = await db.any('SELECT Distinct registration_number  FROM registration;');
        return regNumbers; 
    }

    return{
       insertRegNum,
       selectNumbers

    }
}