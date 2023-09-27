import exphbs from 'express-handlebars';
import express from 'express';
import bodyParser from 'body-parser';
import RegistrationNumberFact from './js/registrationNum.js';
// connect, query, and disconnect is with async/await:
import client from 'pg';

//const client = new Client();
//await client.connect();

let app = express();
//factory function instance
let registrationNumObject = RegistrationNumberFact();

//2.configure express-hanndlebar
const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('home', {
        registrations: registrationNumObject.getRegistration(),
        errorMessages: registrationNumObject.getError(),
        
    });

});
app.post('/reg_numbers',function(req,res){
   let regForTown = req.body.inputNumber;
   registrationNumObject.checkForTown(regForTown)
   res.render('home', {
    registrations:  registrationsForTown
   });
});


app.post('/',function (req, res) {

    let regInput = req.body.inputNumber;
    let error = req.body.inputNumber;

    registrationNumObject.setRegistration(regInput);
    registrationNumObject.setError(error);

    res.redirect('/'); 

});


let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});