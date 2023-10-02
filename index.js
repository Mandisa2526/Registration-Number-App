import exphbs from 'express-handlebars';
import express from 'express';
import bodyParser from 'body-parser';
import RegistrationNumberFact from './js/registrationNum.js';
import flash from  'express-flash';
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

  // initialise session middleware - flash-express depends on it
  app.use(session({
    secret : "<add a secret string here>",
    resave: false,
    saveUninitialized: true
  }));

  // initialise the flash middleware
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res) {
    //req.flash('error', registrationNumObject.getError());
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


app.post('/',async function (req, res) {
    let regInput = req.body.inputNumber;
    registrationNumObject.addRegistration(regInput);
    if (registrationNumObject.getError() === undefined) {
        await database.insertRegNum(regInput);
    }
    
    res.redirect('/'); 
});


let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});