const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const { ulid } = require('ulid')


const ejs = require('ejs');
const path = require('path');
const cors = require('cors'); 

require('dotenv').config();



const PORT = process.env.PORT || 3000;
const COMPANYNAME = 'Kivtechs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const ulidgen=ulid();
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTHO_secret,
  baseURL: process.env.AUTHO_baseURL,
  clientID: process.env.AUTHO_CLIENT_ID,
  issuerBaseURL: process.env.AUTHO_BASEURI_issuer,
};

const app = express();

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
const adminloginEjsPath = path.join(__dirname, '../views/adminlogin.ejs');
const adminpanelEjsPath = path.join(__dirname, '../views/adminpanel.ejs');
const userEjsPath = path.join(__dirname, '../views/userpanel.ejs');
const termsEjsPath = path.join(__dirname, '../views/terms.ejs');
const policyEjsPath = path.join(__dirname, '../views/privacy.ejs');
const powerpackEjsPath = path.join(__dirname, '../views/powerpack.ejs');
const landingEjsPath = path.join(__dirname, '../views/landingpage.ejs');
const errorEjsPath = path.join(__dirname, '../views/404.ejs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({ origin: ['http://localhost:3000', 'https://kivtechs.cloud'] })); // Allow specific origins for CORS
app.use(express.json({ limit: '1mb' })); // Parse JSON data
app.use(express.urlencoded({ limit: '1mb', extended: true })); // Parse form data
  const dummyUser = {
  picture: "https://siddht1.github.io/dashboard_p1/assets/images/faces-clipart/pic-1.png",
  name: "Test User",
  email: "test.user@kivtechs.cloud"
};
// Protected route that requires authentication
app.get('/profile', requiresAuth(), (req, res) => {
  console.log(req.oidc);
  res.send(JSON.stringify(req.oidc.user));
});
app.use((req, res, next) => {  
  if (req.oidc.isAuthenticated()) {  
    res.locals.user = req.oidc.user;  
  } else {  
    res.locals.user = dummyUser;  
  }  
  next();  
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
app.get(['/terms','condition'], (req, res) => {  
  let user;  
  
  if (req.oidc.isAuthenticated()) {  
    user = req.oidc.user;  
  } else {  
    user = dummyUser;  
  }  
  
  res.render(termsEjsPath, { user });  
});  
  
app.get(['/privacy', '/policy'], (req, res) => {
  let user;

  if (req.oidc.isAuthenticated()) {
    user = req.oidc.user;
  } else {
    user = dummyUser;
  }

  res.render(policyEjsPath, { user });
});
app.get(['/powerpack', '/powerpack'], (req, res) => {
  let user;

  if (req.oidc.isAuthenticated()) {
    user = req.oidc.user;
  } else {
    user = dummyUser;
  }

  res.render(powerpackEjsPath, { user });
});

app.all('/admin/dash',(req, res) => {
    let user;
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

//  landing page aka base route
 app.get('/', (req, res) => {
   // Send visitor data to Supabase
   
 
    let visitordata = {
          status: res.statusCode,
        url: req.originalUrl,
        IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        request_body: req.body,
        request_method: req.method,
        lat: req.headers['x-vercel-ip-latitude'],
        lon: req.headers['x-vercel-ip-longitude'],
        location: {city: req.headers['x-vercel-ip-city'], region: req.headers['x-vercel-ip-country-region'], country: req.headers['x-vercel-ip-country']},
        UA: req.headers['user-agent'],
        date_time: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        ulid: ulidgen
};
    console.log(dbdata);
    supabase  
  .from('visitor2')  
  .insert([visitordata])  
  .then(response => {  
    console.log('Data sent to Supabase successfully:', response);  
  })  
  .catch(error => {  
    console.error('Error sending data to Supabase:', error);  
  });  
   //  visitor data end 
   
 res.render(landingEjsPath);
   });


//  authorization route 
app.use('/authorize', (req, res, next) => {  
  if (req.oidc.isAuthenticated()) {  
       // Send to okta Supabase
    let dbdata = {
      ulid: ulidgen, 
      user_details: req.oidc.user
    };
    console.log(dbdata);
    supabase  
  .from('oktausers')  
  .insert([dbdata])  
  .then(response => {  
    console.log('Data sent to Supabase successfully:', response);  
  })  
  .catch(error => {  
    console.error('Error sending data to Supabase:', error);  
  });  


    console.log('User information:', req.oidc.user);
    console.log('Sending to DASH');
    res.redirect('/dash');  
  } else if (req.originalUrl === '/authorize/callback') {
    next();
  } else {  
    console.log('Not login sending to authorize/callback');
    res.oidc.login({  
      returnTo: '/authorize/callback',  
    });  
  }  
});

app.get('/dash', async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.render(userEjsPath, { user: req.oidc.user });

           // Send OKTA data to Supabase
    let dbdata = {
      ulid: ulidgen, user_details: req.oidc.user
    };
    console.log(dbdata);
    supabase  
  .from('oktausers')  
  .insert([dbdata])  
  .then(response => {  
    console.log('Data sent to Supabase successfully:', response);  
  })  
  .catch(error => {  
    console.error('Error sending data to Supabase:', error);  
  }); 
// Supabase OKTA data insert complete

    
  }
  else {
    res.redirect('/authorize');
  }
});
app.all('/feedback', (req, res) => {
  res.send(req.body);
});

//  if none then send 404
app.use((req, res, next) => {
  res.render(errorEjsPath, {
    title: '404 Not Found',
    message: 'The requested page could not be found.',
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(COMPANYNAME + '  listening on port :' + PORT);
});
