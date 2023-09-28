export default function Query(db){
    
    async function insertRegNum(regNum){
        
        await db.none(`INSERT INTO towns(towns_name) VALUES(3,'Cape Town,Somerset West,Wolseley')`);
    }

    return{
       insertRegNum,
    }
}