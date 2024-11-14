const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express()
app.use(cors())
app.use(express.json())


//Connect to mongodb database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to mongoDB"))
    .catch(error => console.log(error))


var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


//Test
app.get('/', (req, res) => {
  res.send(`hello`)
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    }); // Starts the server