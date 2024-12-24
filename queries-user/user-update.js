const { title } = require("process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function whereUserID() {
  rl.question("\n nhap ID muon sua: ", (id) => {
    if (!id || isNaN(id) || id <= 0) {
      console.log("ID lor");
      rl.close();
      return;
    }

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      async (err, results) => {
        if (err) {
          console.error(
            "Lỗi khi tìm kiếm nguoi dung tại ID vừa nhập " + id + err.stack
          );
        }
        if (results.length === 0) {
          console.log(`Không tìm thấy nguoi dung với ID ${id}`);
          rl.close();
          return;
        }
        console.log(results);
        updataUser(id);
      }
    );
  });
}

async function updataUser(id) {
  rl.question("\nNhap username: ", (_username) => {
    rl.question("Nhap password: ", (_password) => {
      rl.question("Nhap email: ", (_email) => {
        rl.question("Nhap role: ", (_role) => {
          if (_role !== "admin") {
            _role = "user";
          }
          connection.query(
            "UPDATE users SET username = ?, password = ?, email = ?, role = ? WHERE id = ?",
            [
              _username.trim(),
              _password.trim(),
              _email.trim(),
              _role.trim(),
              id.trim(),
            ],
            (err, _results) => {
              if (err) {
                console.error("Lỗi khi cập nguoi dung: " + err.stack);
                rl.close();
                return;
              }
              console.log("\n" + _results.affectedRows > 0);
              rl.close();
              selectUsers();
            }
          );
        });
      });
    });
  });
}

module.exports = {
  whereUserID,
};