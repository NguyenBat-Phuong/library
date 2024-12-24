const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function deleteUser() {
  // Kiem tra ID
  rl.question("\nNhập ID sách muốn xóa: ", (id) => {
    if (!id || isNaN(id) || id <= 0) {
      console.log("ID không hợp lệ. Vui lòng nhập một số nguyên dương.");
      rl.close();
      return;
    }
    connection.query(
      "DELETE FROM users WHERE id = ?",
      [id],
      async (err, results) => {
        if (err) {
          console.error("Lỗi khi kiểm tra điều kiện: " + err.stack);
        }
        async (err, results) => {
          connection.query(
            "DELETE FROM loans WHERE user_id = ?",
            [id],
            async (err, results) => {
              if (err) {
                console.error("Lỗi khi xóa nguoi dung: " + err.stack);
                return;
              }
              if (results.affectedRows > 0) {
                console.log(`Đã xóa nguoi dung với ID ${id} thành công.`);
              } else {
                console.log(`Không tìm thấy nguoi dung với ID ${id}.`);
              }

              try {
                selectUsers();
              } catch (error) {
                console.error("Lỗi khi gọi selectUsers():", error);
              }
            }
          );
        };
      }
    );
  });
}

module.exports = {
  deleteUser,
};
