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

// GET route
app.get("/", (req, res) => {
  let latitude = req.headers['x-vercel-ip-latitude'];
  let longitude = req.headers['x-vercel-ip-longitude'];
  let location=req.headers['x-vercel-ip-city']+','+req.headers['x-vercel-ip-country-region']+','+req.headers['x-vercel-ip-country'];

  const weather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true`;
// // Check if 'view' parameter is set to 'chatbot'
// if (req.query.view === 'chatbot') {
// // Redirect to the specified URL
// return res.redirect("https://siddh-kivtechs.github.io/menu_4/");
// }
//   //for ovh
//   //https://ovh.kivtechs.cloud/
//   // Render the client-side JavaScript file dynamically with the values embedded
//   res.render('client', { weather,location });
// });

   switch (req.query.view) {
    case 'chatbot':
      return res.redirect("https://siddh-kivtechs.github.io/menu_4/");
    case 'ovh':
      return res.redirect("https://ovh.kivtechs.cloud/");
    case 'adobe':
      return res.redirect("https://siddh-kivtechs.github.io/kivtechs/");
    default:
      res.send({'status':'not active'});
  }
  res.render('client', { weather: weatherAPIURL, location });
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
