export default function RegistrationNumberFact() {
    let regNumber = [];
    let error = '';

    function setRegistration(number) {
        if(number){
            regNumber.push(number);
        }
    }

    function setError(number){
        
        if(!number){
            error = 'Enter registration number!';
        }else{
            error = undefined;
        }
    }

    function getRegistration(){
        return regNumber;
    }

    function getError(){
        return error;
    }
    
    function checkForTown(number){
       if(number.startsWith("CA")){
          regNumber;
       }
       
    }
    function getForTown(){
        return result;
    }
    return {
        setRegistration,
        getRegistration,
        setError,
        getError,
        checkForTown,
        getForTown
    }
}