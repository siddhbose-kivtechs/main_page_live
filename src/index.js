const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ejs = require('ejs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

app.get("/", baseHandler);

async function baseHandler(req, res) {
  const log = {
    lat: req.headers['x-vercel-ip-latitude'],
    lon: req.headers['x-vercel-ip-longitude'],
    location: req.headers['x-vercel-ip-city'] + ',' + req.headers['x-vercel-ip-country-region'] + ',' + req.headers['x-vercel-ip-country'],
    IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    UA: req.headers['user-agent'],
    uuid: uuidv4(),
    date_time: new Date()
    // date_time: new Date().toLocaleString(undefined, { timeZone: 'user' }) // Change the date time to user's time
  };

  const { data, error } = await supabase.from('visitor').insert([log]);

  if (error) {
    console.error('Error inserting log:', error);
    res.status(500).send('Error inserting log');
  } else {
    console.log('Log inserted successfully:', data);
  }

  let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  redirectView(req.query.view, res, req.headers, ip_address);
}

function redirectView(view, res, headers, ip_address) {
  let latitude = headers['x-vercel-ip-latitude'];
  let longitude = headers['x-vercel-ip-longitude'];
  let location = headers['x-vercel-ip-city'] + ',' + headers['x-vercel-ip-country-region'] + ',' + headers['x-vercel-ip-country'];

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
      res.redirect('https://siddh-kivtechs.github.io/login_sample/');
      break;
    default:
      res.render('client', { latitude, longitude, location, ip_address });
  }
}

app.get('/chao', (req, res) => {
  res.redirect("https://siddh-kivtechs.github.io/menu_4/");
});

app.post("/", (req, res) => {
  console.log("POST request received");
  let data = {};
  data['POST'] = req.body;
  res.send(data);
});

app.get("/logs", async (req, res) => {
  const { data, error } = await supabase.from('visitor').select();

  if (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).send('Error retrieving logs');
  } else {
    console.log('Logs retrieved successfully:', data);
    res.send(data);
  }
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
