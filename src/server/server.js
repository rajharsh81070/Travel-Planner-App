const express = require('express')
const app = express();
const port = process.env.PORT || 3000
const cors = require('cors');

app.use(express.static('dist'));
app.use(cors());

app.get('/', function (req, res) {
  res.status(200).sendFile('dist/index.html');
})

app.listen(port, () => {
  console.log(`The server is runing on http://localhost:${port}`);
})

//for testing
const sum = (a, b) => {
  return a + b;
}

module.exports = sum; 