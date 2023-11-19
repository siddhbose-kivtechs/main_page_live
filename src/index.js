const express = require('express');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
// const helmet = require('helmet');
// const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const COMPANYNAME = 'Kivtechs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTHO_secret,
  baseURL: process.env.AUTHO_baseURL,
  clientID: process.env.AUTHO_CLIENT_ID,
  issuerBaseURL: process.env.AUTHO_BASEURI_issuer,
};

const app = express();
// app.use(morgan('combined'));
// app.use(morgan('combined', { stream: fs.createWriteStream('access.log') })); // Log requests to a file instead of the console
// app.use(helmet());
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       'img-src': ['self', 'data:', 'https://siddh-kivtechs.github.io','https://lh3.googleusercontent.com/','https://siddht1.github.io','https://siddht1.github.io/'],
//       'script-src': ['self', 'https://siddh-kivtechs.github.io','https://siddht1.github.io','https://siddht1.github.io'],
//     },
//   },
// }));


// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
const adminloginEjsPath = path.join(__dirname, '../views/adminlogin.ejs');
const adminpanelEjsPath = path.join(__dirname, '../views/adminpanel.ejs');
const userEjsPath = path.join(__dirname, '../views/userpanel.ejs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({ origin: ['http://localhost:3000', 'https://kivtechs.cloud'] })); // Allow specific origins for CORS
app.use(express.json({ limit: '1mb' })); // Parse JSON data
app.use(express.urlencoded({ limit: '1mb', extended: true })); // Parse form data

// Protected route that requires authentication
app.get('/profile', requiresAuth(), (req, res) => {
  console.log(req.oidc);
  res.send(JSON.stringify(req.oidc.user));
});

// Protected route that requires authentication
app.get('/protected', requiresAuth(), (req, res) => {
  console.log(req.oidc);
  res.send('Access to protected resource granted');
  console.log(req.oidc);
});
//  admin panel login and dashboard
app.get('/admin',(req, res) => {
   res.render(adminloginEjsPath);
});
app.all('/admin/dash',(req, res) => {
    let user;

  const dummyUser = {
  picture: "https://siddht1.github.io/dashboard_p1/assets/images/faces-clipart/pic-1.png",
  name: "Test User",
  email: "test.user@kivtechs.cloud"
};
  
  // Try to retrieve the user from the request object
  if (req.user) {
    user = req.user;
  } else {
    // Use dummyUser as a fallback
    user = dummyUser;
  }
const picture = user.picture || dummyUser.picture;
const name = user.name || dummyUser.name;
const email = user.email || dummyUser.email;
   res.render(adminpanelEjsPath, { user });
});

// Not protected route
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const user = req.oidc.user;
    console.log(user);
    res.render(userEjsPath, { user }); // Render the dashboard for logged-in users
  } else {
    res.redirect('/login'); // Redirect non-logged-in users to the login page
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(COMPANYNAME + '  listening on port :' + PORT);
});
