const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs'); // Set EJS as the template engine
// Enable CORS for specific origin
app.use(cors({
//   origin: "https://example.com"
}));

// Parse request body and extended the size to 1mb

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// GET route
app.get("/", (req, res) => {
  let data = {};
  data["GET"] = req.query;
  res.send(data);
    const latitude = process.env['forwdaded']['x-vercel-ip-latitude']; // Get the latitude value from environment variable
  const longitude = process.env['forwdaded']['x-vercel-ip-longitude']; // Get the longitude value from environment variable

  // Render the client-side JavaScript file dynamically with the values embedded
  res.render('client.ejs', { latitude, longitude });
});

// POST route
app.post("/", (req, res) => {
  console.log("POST request received");
  let data={};
   data['POST'] = req.body;
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
