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

let query = Query(db);
let database = Query(db);
let app = express();
//factory function instance
let registrationNumObject = RegistrationNumberFact(query);

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

app.get('/', async function (req, res) {

   let registrations = await registrationNumObject.getAllRegistration();
    res.render('home', {
        registrations,
        errorMessages: registrationNumObject.getError(),
        success: registrationNumObject.getSuccessMessage()
    });

});


app.post('/reg_numbers', async function(req,res){
   let regForAll = req.body.allRadio;
   let regForTown = req.body.townRadio;
   let registrations = await registrationNumObject.getRegistrationForTown(regForTown);
   let registrationForAll = await registrationNumObject.getAllRegistration(regForAll);
   res.render('home', {
        registrationForAll,
        registrations,
        errorMessages: registrationNumObject.getError(),
   }); 
});
app.get('/reg_numbers/:regNumber', async function(req,res){

    res.render('home', {
        registrations: [ req.params.regNumber ],
    });     
 });
app.get('/reset', async function (req,res){
    registrationNumObject.reset();
    await database.deleteAllUsers();
    res.redirect('/');
});


app.post('/',async function (req, res) {
    let regInput = req.body.inputNumber;
    await registrationNumObject.addRegistration(regInput);
    res.redirect('/'); 
});


let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});