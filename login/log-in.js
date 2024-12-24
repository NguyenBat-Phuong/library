const connection = require("../connect/db");
const util = require("util");

// Chuyển connection.query sang dạng Promise
const query = util.promisify(connection.query).bind(connection);

// Hàm xử lý đăng nhập
async function loginUser(username, password) {
  try {
    // Kiểm tra tài khoản và mật khẩu trong cơ sở dữ liệu
    const results = await query(
      "SELECT username, password FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (results.length === 0) {
      return { success: false, message: "Tài khoản hoặc mật khẩu không đúng." };
    } else {
      return { success: true, message: "Đăng nhập thành công!" };
    }
  } catch (err) {
    console.error("Lỗi trong quá trình đăng nhập:", err);
    return { success: false, message: "Lỗi server." };
  }
}

module.exports = { loginUser };
