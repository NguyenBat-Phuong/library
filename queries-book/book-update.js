const connection = require("../connect/db.js");
const inquirer = require("@inquirer/prompts");

async function question(promptText) {
  return inquirer.input({
    message: promptText,
  });
}

async function whereBookID(_id) {
  try {
    const query = "SELECT id FROM books WHERE id = ?";
    const [results] = await connection.promise().execute(query, [_id]);
    return results.length > 0; // true if book exists
  } catch (err) {
    console.error("Lỗi khi kiểm tra ID:", err.message);
    return false;
  }
}

async function closeConnection() {
  try {
    await connection.end();
  } catch (err) {
    console.error("Lỗi khi đóng kết nối:", err.message);
  }
}

async function updateBook(id) {
  try {
    const exists = await whereBookID(id);
    if (!exists) {
      console.log(`Không tìm thấy sách với ID ${id}.`);
      return;
    }

    // Nhập thông tin mới
    const _title = await question("Title: ");
    const _author = await question("Author: ");
    const _category = await question("Category: ");
    const _publish_year = await question("Publish Year: ");

    if (isNaN(Number(_publish_year))) {
      console.log("Năm xuất bản phải là một số.");
      return;
    }

    let _status = await question("Status (default: available): ");
    if (
      !_status ||
      (_status.toLowerCase() !== "borrowed" &&
        _status.toLowerCase() !== "damaged")
    ) {
      _status = "available";
    }

    // Cập nhật thông tin sách
    const query = `
      UPDATE books
      SET title = ?, author = ?, category = ?, publish_year = ?, status = ?
      WHERE id = ?
    `;
    const values = [_title, _author, _category, _publish_year, _status, id];

    const [results] = await connection.promise().execute(query, values);

    if (results.affectedRows > 0) {
      console.log(`Cập nhật sách với ID ${id} thành công.`);
    } else {
      console.log(`Không tìm thấy sách với ID ${id} để cập nhật.`);
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật sách:", err.message);
  } finally {
    await closeConnection();
  }
}

module.exports = {
  updateBook,
};
