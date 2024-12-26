const connection = require("../connect/db.js");
const inquirer = require("@inquirer/prompts");

async function permissions() {
  try {
    const [results] = await connection.promise().query("SELECT * FROM user_permissions");
    console.log("USERS----------------------");
    console.log(results);
    await checkPermissions();
  } catch (err) {
    console.error("ERROR SELECT user_permissions:" + err.stack);
  }
}

async function checkPermissions() {
  const { id } = await inquirer.input({
    message: "\nChỉnh quyền với ID: ",
  });

  if (!id || isNaN(id) || id <= 0) {
    console.log("ID không hợp lệ");
    return;
  }

  try {
    const [results] = await connection.promise().query(
      "SELECT users.id, users.role, user_permissions.id FROM user_permissions INNER JOIN users ON user_permissions.user_id = users.id WHERE users.id = ?",
      [id]
    );

    if (results.length === 0) {
      console.log(`Không tìm thấy với ID ${id}`);
      return;
    }

    console.log(results);
    await updatePermissions(id);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm tại ID vừa nhập " + id + err.stack);
  }
}

async function updatePermissions(id) {
  const { can_borrow_books } = await inquirer.input({
    message: "\nNhập can_borrow_books (0 hoặc 1): ",
  });

  const { can_manage_books } = await inquirer.input({
    message: "\nNhập can_manage_books (0 hoặc 1): ",
  });

  const { can_manage_users } = await inquirer.input({
    message: "\nNhập can_manage_users (0 hoặc 1): ",
  });

  const values = [
    parseInt(can_borrow_books) === 1 ? 1 : 0,
    parseInt(can_manage_books) === 1 ? 1 : 0,
    parseInt(can_manage_users) === 1 ? 1 : 0,
  ];

  if (values.some((value) => isNaN(value))) {
    console.log("Các giá trị phải là 0 hoặc 1.");
    return;
  }

  try {
    const [results] = await connection.promise().query(
      "UPDATE user_permissions SET can_borrow_books = ?, can_manage_books = ?, can_manage_users = ? WHERE user_id = ?",
      [...values, id]
    );

    if (results.affectedRows > 0) {
      console.log("Cập nhật quyền thành công.");
    } else {
      console.log("Không tìm thấy người dùng với ID " + id);
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật quyền: " + err.stack);
  }
}

module.exports = {
  permissions,
};
