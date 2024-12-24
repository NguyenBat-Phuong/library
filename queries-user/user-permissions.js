const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function permissions() {
  connection.query("SELECT * FROM user_permissions", (err, results) => {
    if (err) {
      console.error("ERROR SELECT user_permissions:" + err.stack);
    }
    console.log("USERS----------------------");
    console.log(results);
    checkPermissions();
  });
}

function checkPermissions() {
  rl.question("\n Chinh sua quyen voi ID: ", (id) => {
    if (!id || isNaN(id) || id <= 0) {
      console.log("ID lor");
      rl.close();
      return;
    }
    connection.query(
      "SELECT users.id, users.role, user_permissions.id FROM user_permissions INNER JOIN users ON user_permissions.user_id = users.id WHERE users.id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Lỗi khi tìm kiếm tại ID vừa nhập " + id + err.stack);
        }
        if (results.length === 0) {
          console.log(`Không tìm thấy với ID ${id}`);
          rl.close();
          return;
        }
        console.log(results);
        updatePermissions(id);
      }
    );
  });
}

function updatePermissions(id) {
  rl.question("\nNhập can_borrow_books: ", (_can_borrow_books) => {
    _can_borrow_books = parseInt(_can_borrow_books);
    if (_can_borrow_books !== 1) {
      _can_borrow_books = 0;
    }

    rl.question("\nNhập can_manage_books: ", (_can_manage_books) => {
      _can_manage_books = parseInt(_can_manage_books);
      if (_can_manage_books !== 1) {
        _can_manage_books = 0;
      }

      rl.question("\nNhập can_manage_users: ", (_can_manage_users) => {
        _can_manage_users = parseInt(_can_manage_users);
        if (_can_manage_users !== 1) {
          _can_manage_users = 0;
        }

        // Kiểm tra giá trị có hợp lệ không (0 hoặc 1)
        if (
          isNaN(_can_borrow_books) ||
          isNaN(_can_manage_books) ||
          isNaN(_can_manage_users)
        ) {
          console.log("Các giá trị phải là 0 hoặc 1.");
          rl.close();
          return;
        }

        // Thực hiện câu lệnh UPDATE với điều kiện WHERE để cập nhật theo id người dùng
        connection.query(
          "UPDATE user_permissions SET can_borrow_books = ?, can_manage_books = ?, can_manage_users = ? WHERE user_id = ?",
          [_can_borrow_books, _can_manage_books, _can_manage_users, id],
          (err, results) => {
            if (err) {
              console.error("Lỗi khi cập nhật quyền: " + err.stack);
              rl.close();
              return;
            }

            if (results.affectedRows > 0) {
              console.log("Cập nhật thành công.");
            } else {
              console.log("Không tìm thấy người dùng với ID " + id);
            }
            rl.close();
          }
        );
      });
    });
  });
}

module.exports = {
  permissions,
};
