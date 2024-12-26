const connection = require("../connect/db.js");
const inquirer = require("@inquirer/prompts");
const bcrypt = require("bcrypt");

async function closeConnection() {
  try {
    await connection.end();
  } catch (err) {
    console.error("Lỗi khi đóng kết nối:", err.message);
  }
}

async function updateUser() {
  const id = await inquirer.input("Nhập ID muốn sửa: ");
  if (!id || isNaN(id) || id <= 0) {
    console.log("ID không hợp lệ");
    return;
  }

  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [id]);

    if (results.length === 0) {
      console.log(`Không tìm thấy người dùng với ID ${id}`);
      return;
    }

    console.log(results);
    await whereUserID(id);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm người dùng:", err.message);
  }
}

async function whereUserID(id) {
  const saltRounds = 10; // Số vòng tính toán cho bcrypt
  const _username = await inquirer.input("Nhập username: ");
  const _password = await inquirer.input("Nhập password: ");
  const _email = await inquirer.input("Nhập email: ");
  let _role = await inquirer.input("Nhập role: ");

  // Kiểm tra dữ liệu nhập vào
  if (!_username || !_password || !_email) {
    console.log("Username, password, và email không thể để trống.");
    return;
  }

  const hashedPassword = await bcrypt.hash(_password, saltRounds);

  //Mặc định là user
  if (_role !== "admin") {
    _role = "user";
  }

  try {
    const [results] = await connection
      .promise()
      .execute(
        "UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?",
        [_username, hashedPassword, _email, _role, id]
      );

    if (results.affectedRows > 0) {
      console.log("\nCập nhật người dùng thành công!");
    } else {
      console.log("\nKhông có sự thay đổi nào.");
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật người dùng: " + err.stack);
  } finally {
    await closeConnection();
  }
}

module.exports = {
  updateUser,
};
