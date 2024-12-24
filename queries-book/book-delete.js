const connection = require("../connect/db.js");

const question = async (promptText) => {
  return require("@inquirer/prompts").input({
    message: promptText,
  });
};

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

    // Xóa sách với điều kiện trạng thái
    const deleteBookQuery =
      "DELETE FROM books WHERE id = ? AND (LOWER(status) = 'available' OR LOWER(status) = 'damaged')";
    const bookResults = await queryAsync(deleteBookQuery, [id]);

    if (bookResults.affectedRows === 0) {
      console.log(
        `Không tìm thấy sách với ID ${id} hoặc sách không có trạng thái 'available' hoặc 'damaged'.`
      );
      return;
    }

    // Xóa bản ghi trong bảng statistics
    const deleteStatisticsQuery = "DELETE FROM statistics WHERE book_id = ?";
    const statisticsResults = await queryAsync(deleteStatisticsQuery, [id]);

    // Xóa bản ghi trong bảng loans
    const deleteLoansQuery = "DELETE FROM loans WHERE book_id = ?";
    const loansResults = await queryAsync(deleteLoansQuery, [id]);

    console.log(`Đã xóa sách với ID ${id} thành công.`);
  } catch (err) {
    console.error("Lỗi khi xóa sách: " + err.stack);
  } finally {
    connection.end();
  }
}

module.exports = {
  deleteBook,
};
