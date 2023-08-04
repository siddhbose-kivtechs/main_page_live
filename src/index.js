const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ejs = require('ejs');
const path = require("path");
const { sql } = require("@vercel/postgres");

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, '../views')); // Update the path to '/views'

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public'))); // Update the path to '/public'

// Enable CORS for specific origin
app.use(cors());

// test postgress
//const likes = 100;

//const { rows } = await sql`SELECT * FROM posts WHERE likes > ${likes};`;

// Parse request body and extend the size to 1mb
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));


app.get("/", baseHandler);

function baseHandler(req, res) {
  let latitude = req.headers['x-vercel-ip-latitude'];
  let longitude = req.headers['x-vercel-ip-longitude'];
  let location = req.headers['x-vercel-ip-city'] + ',' + req.headers['x-vercel-ip-country-region'] + ',' + req.headers['x-vercel-ip-country'];

  const weather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true`;
let ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
 redirectView(req.query.view, res, latitude,longitude, location,ip_address);

}

function redirectView(view, res, latitude,longitude, location,ip_address) {
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
    default:
      res.render('client', { latitude,longitude, location,ip_address });
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
