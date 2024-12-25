const express = require("express");

const server = express();
const port = 3000;

server.use(express.json()); //Middleware

server.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    res.status(200).json({ message: "Đăng nhập thành công!" });
  } else {
    res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu." });
  }
});

server.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});

module.exports = server;
