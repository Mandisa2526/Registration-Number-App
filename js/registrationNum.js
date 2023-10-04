export default function RegistrationNumberFact(query) {
    let error = '';
    let letters =   /^[A-Z]{0,2}$/;

    async function addRegistration(regNumber) {
        await setError(regNumber);
        if (!error) {
            await query.insertRegNum(regNumber);
        }
    }

    async function setError(regNumber){
        let regNumbers = await getAllRegistration();
        if(!regNumber){
            error = 'Enter registration number!';
        //go through the an array
        //check if the regNumber is in an array
        } else if (regNumbers.indexOf(regNumber) !== -1) {
            error = "Registration number exists!";
        } else if ( regNumber.length > 10) {
            error = 'Maximum Legnth exceeded!';
            //should not allow more than 2 Alphabet characters
        } else{
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
        return error;
    }

    async function getRegistrationForTown(town) {
        let regNumbers = await getAllRegistration();
        let registrationsForTown = regNumbers.filter(element => element.startsWith(town));
        if(registrationsForTown.length == 0){
            error = "Cannot Filter town not added!";
       }
       return registrationsForTown;
    }

    return {
        getAllRegistration,
        getError,
        setError,
        getRegistrationForTown,
        addRegistration
    }
}