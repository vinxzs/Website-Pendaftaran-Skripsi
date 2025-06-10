require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // asal frontend
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json()); 

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3012;
app.listen(PORT, () => {
	console.log(`Server sedang berjalan pada http://localhost:${PORT}`);
});
