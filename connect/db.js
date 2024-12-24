const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Tạo kết nối MySQL
const connectionMysql = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  queueLimit: 0 
});

// Kết nối cơ sở dữ liệu
connectionMysql.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối: " + err.stack);
    return;
  }
  // console.log("Kết nối thành công với ID " + connectionMysql.threadId );
});

module.exports = connectionMysql;
