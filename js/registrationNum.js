export default function RegistrationNumberFact(query) {
    let successMessage;
    let error = '';
    
 //add registration and transfer to upper case
    async function addRegistration(regNumber) {
        let regNumtoCap = regNumber.toUpperCase();
        await validateRegistrationNumber(regNumtoCap);
        if (!error) {
            error = await query.insertRegNum(regNumtoCap);
        }
    }

    async function validateRegistrationNumber(regNumber){
        let regNumbers = await getAllRegistration();
        if(!regNumber){
            error = 'Please enter a registration number!';
        //go through the an array
        //check if the regNumber is in an array
        } else if (regNumbers.indexOf(regNumber) !== -1) {
            error = regNumber + ' already exists! Please enter a new registration number.';
        } else if ( regNumber.length > 10) {
            error = 'Maximum length exceeded!';
            
        }else if ( regNumber.length < 7) {
            error = 'Minimum length exceeded!';  
        }else {
            error = undefined;
        }
    }

    async function getAllRegistration() {
        let numbers = [];
        let result = await query.getRegistrations();
        result.forEach(element => {
            numbers.push(element.registration_number);
        });
        return numbers;
    }

    function getError() {
        let result = error
        error = undefined
        return result;
    }
    function getSuccessMessage(){
        let message = successMessage;
        successMessage = '';
        return message;
    }

    function validateRegistrationsForTown(registrationsForTown) {
        if(registrationsForTown.length == 0){
            error = "Town was not added!";
        }else {
            error = undefined;
        }
    }
    async function getRegistrationForTown(town) {
        let regNumbers = await getAllRegistration();
        if (town == 'All') {
            return regNumbers;
        }
        let registrationsForTown = regNumbers.filter(element => element.startsWith(town));
        validateRegistrationsForTown(registrationsForTown);
        return registrationsForTown;
    }
    function reset(){
        successMessage = 'Successfully Cleared';
        error;
    }

    return {
        getAllRegistration,
        getError,
        validateRegistrationNumber,
        getRegistrationForTown,
        addRegistration,
        reset,
        getSuccessMessage
    }
}