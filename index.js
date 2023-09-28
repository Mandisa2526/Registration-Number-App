import exphbs from 'express-handlebars';
import express from 'express';
import bodyParser from 'body-parser';
import RegistrationNumberFact from './js/registrationNum.js';
import pgPromise from 'pg-promise';
import  session from 'express-session';
import Query from './Query/queryReg.js';

// Create Database Connection
const pgp = pgPromise();
const connectionString = "postgres://lgcqntdq:P4UKjMZH_2xNewSFy46RaG55YEmwDqsJ@mahmud.db.elephantsql.com/lgcqntdq?ssl=true";
const db = pgp(connectionString);

let database = Query(db);

let app = express();
//factory function instance
let registrationNumObject = RegistrationNumberFact(db);

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
        registrations: registrationNumObject.getAllRegistration(),
        errorMessages: registrationNumObject.getError(),
    });

});


app.post('/reg_numbers',function(req,res){
   let regForTown = req.body.townRadio;
   res.render('home', {
        registrations:  registrationNumObject.getRegistrationForTown(regForTown),
   }); 
});


app.post('/',function (req, res) {
    let regInput = req.body.inputNumber;
    registrationNumObject.addRegistration(regInput);
    res.redirect('/'); 
});


let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});