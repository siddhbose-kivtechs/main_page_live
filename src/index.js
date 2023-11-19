const express = require('express');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config();
const ejs = require('ejs');
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const COMPANYNAME='Kivtechs';


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTHO_secret,
  baseURL: process.env.AUTHO_baseURL,
  clientID: process.env.AUTHO_CLIENT_ID,
  issuerBaseURL: process.env.AUTHO_BASEURI_issuer
};

const app = express();
app.use(morgan('combined'));
app.use(helmet());

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
const dashEjsPath = path.join(__dirname, "../views/dash.ejs");

app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
// app.use(bodyParser.json({ limit: '1mb' }));
// app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));


// // req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//     const user = req.oidc.user;
//     console.log(user)
//   // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
//      res.render(dashEjsPath, { user });
// });
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const user = req.oidc.user;
    console.log(user);
    res.render(dashEjsPath, { user }); // Render the dashboard for logged-in users
  } else {
    res.redirect('/login'); // Redirect non-logged-in users to the login page
  }
});

app.get('/profile', requiresAuth(), (req, res) => {
  console.log(req.oidc);
  res.send(JSON.stringify(req.oidc.user));
});

// Protected route that requires authentication
app.get('/protected', (req, res) => {
   console.log(req.oidc);
  if (req.oidc.isAuthenticated()) {
    // User is authenticated, access protected resource
    res.send('Access to protected resource granted');
     console.log(req.oidc);
  } else {
    // User is not authenticated, redirect to login
    res.redirect('/login');
     console.log(req.oidc);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(COMPANYNAME+'  listening on port :'+PORT);
});
