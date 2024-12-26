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

async function deleteBook() {
  try {
    const id = await question("Nhập ID sách muốn xóa:");

    if (!id || isNaN(id) || id <= 0) {
      console.log("ID không hợp lệ. Vui lòng nhập một số nguyên dương.");
      return;
    }

    // Bắt đầu giao dịch
    await queryAsync("START TRANSACTION");

    // Xóa sách với điều kiện
    const deleteBookQuery =
      "DELETE FROM books WHERE id = ? AND (LOWER(status) = 'available' OR LOWER(status) = 'damaged')";
    const bookResults = await queryAsync(deleteBookQuery, [id]);

    if (bookResults.affectedRows === 0) {
      console.log(
        `Không tìm thấy sách với ID ${id} hoặc sách không có trạng thái 'available' hoặc 'damaged'.`
      );
      await queryAsync("ROLLBACK");
      return;
    }

    // Xóa bản ghi trong bảng statistics
    const deleteStatisticsQuery = "DELETE FROM statistics WHERE book_id = ?";
    const statisticsResults = await queryAsync(deleteStatisticsQuery, [id]);

    // Xóa bản ghi trong bảng loans
    const deleteLoansQuery = "DELETE FROM loans WHERE book_id = ?";
    const loansResults = await queryAsync(deleteLoansQuery, [id]);

    // Cam kết giao dịch
    await queryAsync("COMMIT");

    console.log(`Đã xóa sách với ID ${id} thành công.`);
    console.log(`Bản ghi xóa từ bảng statistics: ${statisticsResults.affectedRows}`);
    console.log(`Bản ghi xóa từ bảng loans: ${loansResults.affectedRows}`);
  } catch (err) {
    // Hoàn tác giao dịch khi xảy ra lỗi
    await queryAsync("ROLLBACK");
    console.error("Lỗi khi xóa sách: " + err.message);
  } finally {
    connection.end();
  }
}

module.exports = {
  deleteBook,
};
