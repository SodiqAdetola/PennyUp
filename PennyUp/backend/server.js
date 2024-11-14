const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express()
app.use(cors())
app.use(express.json())

//Connect to mongodb database
mongoose.connect(process.env.MONGODB_URI, { 
    userNewUrlParser: true,
     useUnifiedTopology: true 
    })
    .then(() => console.log("Connected to mongoDB"))
    .catch(error => console.log(error))


//Test
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    }); // Starts the server