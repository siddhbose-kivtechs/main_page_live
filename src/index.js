const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ejs = require('ejs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const argon2 = require('argon2');
const crypto = require('crypto');

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
  // ... existing code ...

  const { data, error } = await supabase.from('visitor').insert([log]);

  // ... existing code ...
}

function redirectView(view, res, headers, ip_address) {
  // ... existing code ...
}

app.get('/chao', (req, res) => {
  // ... existing code ...
});

app.post("/", async (req, res) => {
  try {
    console.log("POST request received");

    const { email, password } = req.body;

    const loginData = {
      email,
      password
    };

    const passwordHash = await argon2.hash(loginData.password);
    console.log('Password hash:', passwordHash);

    loginData.password = passwordHash;
    console.log('Updated login data:', loginData);

    const { data, error } = await supabase.from('login').insert([loginData]);

    if (error) {
      console.error('Error inserting login data:', error);
      res.status(500).json({ error: 'Error inserting login data' });
    } else {
      console.log('Login data inserted successfully:', data);
      res.json({ success: true }); // Send a success response as JSON
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response as JSON
  }
});

app.get("/logs", async (req, res) => {
  const { data, error } = await supabase.from('visitor').select();

  if (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ error: 'Error getting log data' });
  } else {
    console.log('Logs retrieved successfully:', data);
    res.json(data); // Send the logs data as JSON
  }
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
