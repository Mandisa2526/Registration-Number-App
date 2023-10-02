export default function RegistrationNumberFact() {
    let regNumbers = [];
    let error = '';
     let letters =   /^[A-Z]{0,2}$/;;
    
    function addRegistration(regNumber) {
        setError(regNumber);
        if (!error) {
            regNumbers.push(regNumber);
        }
    }

    function setError(regNumber){
        
        if(!regNumber){
            error = 'Enter registration number!';
        //go through the an array
        //check if the regNumber is in an array
        } else if(regNumbers.indexOf(regNumber) !== -1){
            error = "Registration number exists!";
        }else if( regNumber.length > 10 || regNumber.length <= 6){
            error = 'Invalid format!';
            //should not allow more than 2 Alphabet characters
        }else if(!regNumber.match(letters)){
            error = 'Invalid format!';
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
        getAllRegistration,
        getError,
        setError,
        getRegistrationForTown,
        addRegistration
    }
}