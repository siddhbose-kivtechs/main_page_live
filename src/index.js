const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ejs = require('ejs');
const path = require("path");
const { get, set } = require('@vercel/edge-config');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, '../views')); // Update the path to '/views'

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public'))); // Update the path to '/public'

// Enable CORS for specific origin
app.use(cors());

// Parse request body and extend the size to 1mb
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

app.get("/", baseHandler);

async function baseHandler(req, res) {
  let latitude = get(req.headers, 'x-vercel-ip-latitude');
  let longitude = get(req.headers, 'x-vercel-ip-longitude');
  let location = `${get(req.headers, 'x-vercel-ip-city')},${get(req.headers, 'x-vercel-ip-country-region')},${get(req.headers, 'x-vercel-ip-country')}`;

  const weather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true`;
  let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Store IP, user-agent, latitude, longitude, and place in the Edge Config database
  await set('ip', ip_address);
  await set('user-agent', req.headers['user-agent']);
  await set('latitude', latitude);
  await set('longitude', longitude);
  await set('place', location);

  redirectView(req.query.view, res, latitude, longitude, location, ip_address);
}

function redirectView(view, res, latitude, longitude, location, ip_address) {
  switch (view) {
    case 'chatbot':
      res.redirect("https://siddh-kivtechs.github.io/menu_4/");
      break;
    case 'ovh':
      res.redirect("https://ovh.kivtechs.cloud/");
      break;
    case 'adobe':
      res.redirect("https://siddh-kivtechs.github.io/kivtechs/");
      break;
    case 'tts':
      res.redirect("https://jstts1.kivtechs.cloud/");
      break;
    case 'image_api':
      res.redirect("https://image.kivtechs.cloud/");
      break;
    case 'login':
      res.direct('https://siddh-kivtechs.github.io/login_sample/');
      break;
    default:
      res.render('client', { latitude, longitude, location, ip_address });
  }
}

app.get('/chao', (req, res) => {
  // Handle GET request to /chao path
  res.redirect("https://siddh-kivtechs.github.io/menu_4/");
});

// POST route
app.post("/", (req, res) => {
  console.log("POST request received");
  let data = {};
  data['POST'] = req.body;
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
