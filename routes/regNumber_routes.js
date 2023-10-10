   
export default function registrationNumberApp(registrationNumObject, query) {

    async function pageLoad(req, res) {
        let registrations = await registrationNumObject.getAllRegistration();
        res.render('home', {
            registrations,
            errorMessages: registrationNumObject.getError(),
            success: registrationNumObject.getSuccessMessage()
        });

    };


    async function get(req, res) {
        let regForAll = req.body.allRadio;
        let regForTown = req.body.townRadio;
        let registrations = await registrationNumObject.getRegistrationForTown(regForTown);
        let registrationForAll = await registrationNumObject.getAllRegistration(regForAll);
        res.render('home', {
            registrationForAll,
            registrations,
            errorMessages: registrationNumObject.getError(),
        });
    };
    async function getReg(req, res) {

        res.render('home', {
            registrations: [req.params.regNumber],
        });
    };

    async function reset(req, res) {
        registrationNumObject.reset();
        await query.deleteAllUsers();
        res.redirect('/');
    };

//add registration
    async function add(req, res) {
        let regInput = req.body.inputNumber;
        await registrationNumObject.addRegistration(regInput);
        res.redirect('/');
    };

    return {
        pageLoad,
        add,
        reset,
        get,
        getReg
    }
}