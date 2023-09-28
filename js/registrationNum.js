export default function RegistrationNumberFact() {
    let regNumbers = [];
    let error = '';

    function addRegistration(regNumber) {
        if(regNumber){
            regNumbers.push(regNumber);
        }
        setError(regNumber);
    }

    function setError(number){
        
        if(!number){
            error = 'Enter registration number!';
        }else{
            error = undefined;
        }
    }

    function getAllRegistration() {
        return regNumbers;
    }

    function getError() {
        return error;
    }

    function getRegistrationForTown(town) {
        return regNumbers.filter(element => element.startsWith(town)); 
    }
    return {
        addRegistration,
        getAllRegistration,
        getError,
        getRegistrationForTown
    }
}