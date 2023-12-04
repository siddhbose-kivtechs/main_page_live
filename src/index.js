const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
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
 res.render(landingEjsPath);
   });

// app.use('/authorize', (req, res, next) => {  
//   if (req.oidc.isAuthenticated()) {  
//     console.log('User information:', req.oidc.user);
//     console.log('Sending to DASH');
//     res.redirect('/dash');  
//    } else {  
//     console.log('Not login sending to authorize/callback');
//     //  temprarily disabled to stop loop 
//     // res.oidc.login({  
//     //   returnTo: '/authorize/callback',  
//     // });  
//   }  
// });

// app.use('/authorize', (req, res, next) => {  
//   if (req.oidc.isAuthenticated()) {  
//     console.log('User information:', req.oidc.user);
//     console.log('Sending to DASH');
//     res.redirect('/dash');  
//   } else if (req.originalUrl === '/authorize/callback') {
//     next();
//   } else {  
//     console.log('Not login sending to authorize/callback');
//     res.oidc.login({  
//       returnTo: '/authorize/callback',  
//     });  
//   }  
// });



// app.get('/authorize/callback', async (req, res, next) => {
//   try {
//     const user = await req.oidc.getUser();
//     if (user) {
//       res.redirect('/dash');
//     } else {
//       res.redirect('/authorize');
//     }
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// });


// app.post('/authorize/callback',(req,res) => {
// console.log(req.body);
// });

        
// app.get('/dash', (req, res) => {
//   if(req.oidc.user) {
//     // User is authenticated, render the dash page with the user object
//     res.render(userEjsPath, { user: req.oidc.user });
//   } else {
//     // User is not authenticated, redirect them to the login page
//     res.redirect('/authorize');
//   }
// });

// app.use('/authorize', (req, res) => {  
//   if (req.oidc.isAuthenticated()) {  
//     res.redirect('/dash');  
//   } else {  
//     res.redirect('/login');
//   }  
// }); 
//  handle all the methods to  /authorize/callback
// app.all('/authorize/callback', (req, res, next) => {
//   const { oidc } = req;
//   if (!oidc) {
//     console.log('Auth0 OIDC object not found');
//     return res.redirect('/login');
//   }
//   const { user } = oidc;
//   if (!user) {
//     console.log('Auth0 user object not found');
//     return res.redirect('/login');
//   }
//   console.log('User information:', user);
//   res.redirect('/dash');
// });
// app.all('/authorize/callback', (req, res, next) => {
//   const { oidc } = req;
//   if (!oidc) {
//     console.log('Auth0 OIDC object not found');
//     return res.redirect('/authorize');
//   }
//   const { user } = oidc;
//   if (!user) {
//     console.log('Auth0 user object not found');
//     return res.redirect('/authorize');
//   }
//   console.log('User information:', user);
//   res.redirect('/dash');
// });



app.get('/dash', (req, res) => {
  if(req.oidc.isAuthenticated()) {
    res.render(userEjsPath, { user: req.oidc.user });
  } else {
    res.redirect('/authorize');
  }
});
app.get('/authorize', (req, res, next) => {  
  if (req.oidc.isAuthenticated()) {  
    console.log('User information:', req.oidc.user);
    console.log('Sending to DASH');
    res.redirect('/dash');  
  } else {  
    console.log('Not login sending to authorize/callback');
    req.oidc.login({  
      returnTo: '/authorize/callback',  
    });  
  }  
});
app.get('/authorize/callback', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    console.log('User information:', req.oidc.user);
    res.redirect('/dash');
  } else {
    console.log('Auth0 user object not found');
    res.redirect('/authorize');
  }
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
