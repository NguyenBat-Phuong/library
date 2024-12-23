const mysql = require("mysql2");
require("dotenv").config();

// Tạo kết nối MySQL
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   // password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1",
  database: "library",
});
// Kết nối cơ sở dữ liệu
connection.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối: " + err.stack);
    return;
  }
  console.log("Kết nối thành công với ID " + connection.threadId);
});

module.exports = connection;
