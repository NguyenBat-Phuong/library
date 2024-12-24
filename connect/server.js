const express = require("express");
const bodyParser = require("body-parser");

const server = express();
const port = 3000;

server.use(bodyParser.json()); //Middleware

server.get("/", (req, res) => {
  res.status(200).json({ Message: 'connect server "\ok\"' });
});

server.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});

module.exports = server;
