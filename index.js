// Import ExpressJS
import express from 'express';

// Import middleware
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';

// Import modules
import Query from './services/queryReg.js';
import db from './routes/database_connect.js'
import registrationNumberApp from './routes/regNumber_routes.js'
import RegistrationNumberFact from './js/registrationNum.js';

// Setup a simple ExpressJS server
const app = express();

//2.configure express-hanndlebar
const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

  //initialise session middleware - flash-express depends on it
  app.use(session({
    secret : '<add a secret string here>',
    resave: false,
    saveUninitialized: true
  }));

  // initialise the flash middleware
  app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

// Instantiate the app
let query = Query(db);
let regNumInstance = RegistrationNumberFact(query);
let regNumApp = registrationNumberApp(regNumInstance, query);


// Routes
// TODO: bug fix required - keep showing selected town after filtering
app.get('/',regNumApp.pageLoad);
app.post('/',regNumApp.add); // Add button clicked
app.get('/reset', regNumApp.reset); // Reset button clicked
app.post('/reg_numbers/',regNumApp.get); // Show button clicked
app.get('/reg_numbers/:regNumber', regNumApp.getReg); // Registration number clicked

let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});