const bcrypt = require('bcrypt');
const connection = require("../connect/db");
const util = require("util");

// Chuyển connection.query sang dạng Promise
const query = util.promisify(connection.query).bind(connection);

async function loginUser(username, password) {
  try {
    // Kiểm tra tài khoản trong cơ sở dữ liệu
    const results = await query(
      "SELECT username, password FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return { success: false, message: "Tài khoản không tồn tại." };
    }

    // Lấy mật khẩu đã mã hóa từ cơ sở dữ liệu
    const hashedPassword = results[0].password;

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      return { success: true, message: "Đăng nhập thành công!" };
    } else {
      return { success: false, message: "Tai khoan hoac mat khau không đúng." };
    }
  } catch (err) {
    console.error("Lỗi trong quá trình đăng nhập:", err);
    return { success: false, message: "Lỗi server." };
  }
}

module.exports = { loginUser };
