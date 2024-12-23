const connection = require("./db");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function login() {
  try {
    const _username = await askQuestion("Tài khoản: ");
    let _password = await askQuestion("Mật khẩu: ");

    if (!_password) {
      console.log("Không để trống mật khẩu");
      return login();
    }

    // Kiểm tra tài khoản và mật khẩu trong cơ sở dữ liệu
    connection.query(
      "SELECT username, password FROM users WHERE username = ? AND password = ?",
      [_username, _password],
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn:", err.stack);
          return;
        }

        if (results.length === 0) {
          console.log("Tài khoản hoặc mật khẩu không đúng.");
          return login();
        } else {
          console.log("Đăng nhập thành công!");
        }
      }
    );
  } catch (err) {
    console.error("Lỗi trong quá trình đăng nhập:", err);
  }
}
// Đóng kết nối
// connection.end((err) => {
//   if (err) {
//     console.error("Lỗi khi đóng kết nối:", err.stack);
//   } else {
//     console.log("Đóng kết nối thành công.");
//   }
// });

login();
