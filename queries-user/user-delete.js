const connection = require("../connect/db.js");
const inquirer = require("@inquirer/prompts");

async function question(promptText) {
  return inquirer.input({
    message: promptText,
  });
}

function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function deleteUser() {
  try {
    const id = await question("\nNhập ID người dùng muốn xóa: ");

    if (!id || isNaN(id) || id <= 0) {
      console.log("ID không hợp lệ. Vui lòng nhập một số nguyên dương.");
      return;
    }

    // Bắt đầu giao dịch
    await queryAsync("START TRANSACTION");

    // Xóa người dùng
    const deleteUserQuery = "DELETE FROM users WHERE id = ?";
    const deleteUserResult = await queryAsync(deleteUserQuery, [id]);

    if (deleteUserResult.affectedRows === 0) {
      console.log(`Không tìm thấy người dùng với ID ${id}.`);
      await queryAsync("ROLLBACK");
      return;
    }

    // Xóa các bản ghi bảng loans
    const deleteLoansQuery = "DELETE FROM loans WHERE user_id = ?";
    const deleteLoansResult = await queryAsync(deleteLoansQuery, [id]);

    if (deleteLoansResult.affectedRows > 0) {
      console.log(`Đã xóa người dùng với ID ${id} thành công.`);
      console.log(`Đã xóa muon tra người dùng với ID ${id} .`);
    } else {
      console.log(`Đã xóa người dùng với ID ${id} thành công.`);
      console.log(
        `Không tìm thấy bản ghi mượn nào liên quan đến người dùng ID ${id}.`
      );
    }

    // Commit giao dịch
    await queryAsync("COMMIT");

    // Gọi lại selectUsers
    // try {
    //   await selectUsers();
    // } catch (error) {
    //   console.error("Lỗi khi gọi selectUsers():", error);
    // }
  } catch (err) {
    console.error("Lỗi khi xóa người dùng: " + err.message);
    await queryAsync("ROLLBACK");
  } finally {
    connection.end();
  }
}

module.exports = {
  deleteUser,
};
