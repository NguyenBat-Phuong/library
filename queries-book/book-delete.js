const connection = require("../db.js");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function selectBooks() {
  connection.query("SELECT * FROM books", (err, results) => {
    if (err) {
      console.error("ERROR SELECT BOOKS:" + err.stack);
    }
    console.log("BOOKS----------------------");
    console.log(results);
    deleteBook();
  });
}

async function deleteBook() {
  // Kiem tra ID
  rl.question("\nNhập ID sách muốn xóa: ", (id) => {
    if (!id || isNaN(id) || id <= 0) {
      console.log("ID không hợp lệ. Vui lòng nhập một số nguyên dương.");
      rl.close();
      return;
    }
    connection.query(
      "DELETE FROM books WHERE id = ? AND (LOWER(status) = 'available' OR LOWER(status) = 'damaged')",
      [id],
      async (err, results) => {
        if (err) {
          console.error("Lỗi khi kiểm tra điều kiện: " + err.stack);
        }
        connection.query(
          "DELETE FROM statistics WHERE book_id = ?",
          [id],
          async (err, results) => {
            connection.query(
              "DELETE FROM loans WHERE book_id = ?",
              [id],
              async (err, results) => {
                if (err) {
                  console.error("Lỗi khi xóa sách: " + err.stack);
                  return;
                }

                if (results.affectedRows > 0) {
                  console.log(`Đã xóa sách với ID ${id} thành công.`);
                } else {
                  console.log(
                    `Không tìm thấy sách với ID ${id} hoặc sách không có trạng thái 'available' hoặc 'damaged'.`
                  );
                }

                try {
                  selectBooks();
                } catch (error) {
                  console.error("Lỗi khi gọi selectBooks():", error);
                }
              }
            );
          }
        );
      }
    );
  });
}

selectBooks();

module.exports = {
  deleteBook,
  selectBooks,
};
