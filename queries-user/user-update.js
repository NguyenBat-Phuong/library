const connection = require("../connect/db.js");
const inquirer = require("@inquirer/prompts");

async function closeConnection() {
  try {
    await connection.end();
  } catch (err) {
    console.error("Lỗi khi đóng kết nối:", err.message);
  }
}

async function whereUserID() {
  const id = await inquirer.input("\nNhập ID muốn sửa: ");
  if (!id || isNaN(id) || id <= 0) {
    console.log("ID không hợp lệ");
    return false;
  }

  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [id]);

    if (results.length === 0) {
      console.log(`Không tìm thấy người dùng với ID ${id}`);
      return false;
    }

    console.log(results);
    await updateUser(id);
    return true;
  } catch (err) {
    console.error("Lỗi khi tìm kiếm người dùng:", err.message);
    return false;
  }
}

async function updateUser(id) {
  const _username = await inquirer.input("Nhập username: ");
  const _password = await inquirer.input("Nhập password: ");
  const _email = await inquirer.input("Nhập email: ");
  let _role = await inquirer.input("Nhập role: ");

  if (_role !== "admin") {
    _role = "user";
  }

  try {
    const [results] = await connection
      .promise()
      .execute(
        "UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?",
        [_username.trim(), _password.trim(), _email.trim(), _role.trim(), id]
      );

    if (results.affectedRows > 0) {
      console.log("\nCập nhật người dùng thành công!");
    } else {
      console.log("\nKhông có sự thay đổi nào.");
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật người dùng: " + err.stack);
  }
}

module.exports = {
  whereUserID,
};
