const connection = require("../connect/db.js");
const bcrypt = require("bcrypt");
const inquirer = require("@inquirer/prompts");
const util = require("util");

// Chuyển connection.query sang dạng Promise
const query = util.promisify(connection.query).bind(connection);

async function question(promptText) {
  return inquirer.input({
    message: promptText,
  });
}

async function loginUser() {
  try {
    const username = await question("Tài khoản:");
    const password = await question("Mật khẩu:");

    // Truy vấn tìm tài khoản trong cơ sở dữ liệu
    const results = await query(
      "SELECT username, password FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      console.log("Tài khoản không tồn tại. Vui lòng thử lại.");
      await loginUser();
      return { success: false, message: "Tài khoản không tồn tại." };
    }

    // Lấy mật khẩu mã hóa từ cơ sở dữ liệu
    const hashedPassword = results[0].password;

    // So sánh mật khẩu nhập vào với mật khẩu mã hóa
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      console.log("Đăng nhập thành công!");
      return { success: true, message: "Đăng nhập thành công." };
    } else {
      console.log("Mật khẩu không đúng. Vui lòng thử lại.");
      await loginUser();
      return { success: false, message: "Mật khẩu không đúng." };
    }
  } catch (err) {
    console.error("Đã xảy ra lỗi khi thực hiện đăng nhập:", err.message);
    return { success: false, message: "Lỗi hệ thống." };
  } finally {
    connection.end;
  }
}
module.exports = {
  loginUser,
};
