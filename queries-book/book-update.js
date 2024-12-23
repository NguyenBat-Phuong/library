const { title } = require("process");
const connection = require("../db.js");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function selectbooks() {
  connection.query("SELECT * FROM books", (err, results) => {
    if (err) {
      console.error("ERROR UPDATE BOOKS:" + err.stack);
    }
    console.log("BOOKS----------------------");
    console.log(results);
    whereBookID();
  });
}

async function whereBookID() {
  rl.question("\n nhap ID muon sua: ", (id) => {
    if (!id || isNaN(id) || id <= 0) {
      console.log("ID lor");
      rl.close();
      return;
    }

    connection.query(
      "SELECT * FROM books WHERE id = ?",
      [id],
      async (err, results) => {
        if (err) {
          console.error(
            "Lỗi khi tìm kiếm sách tại ID vừa nhập " + id + err.stack
          );
        }
        if (results.length === 0) {
          console.log(`Không tìm thấy sách với ID ${id}`);
          rl.close();
          return;
        }
        console.log(results);
        updataBook(id);
      }
    );
  });
}

async function updataBook(id) {
  rl.question("\nNhap title: ", (_title) => {
    rl.question("Nhap author: ", (_author) => {
      rl.question("Nhap category: ", (_category) => {
        rl.question("Nhap publish_year: ", (_publish_year) => {
          if (isNaN(_publish_year)) {
            console("Năm xuất bản phải là một số");
            updataBook(id);
          }
          rl.question("Nhap status: ", (_status) => {
            if (_status !== "borrowed" && _status !== "damaged") {
              _status = "available";
            }
            connection.query(
              "UPDATE books SET title = ?, author = ?, category = ?, publish_year = ?, status = ? WHERE id = ?",
              [
                _title.trim(),
                _author.trim(),
                _category.trim(),
                _publish_year.trim(),
                _status.trim(),
                id.trim(),
              ],
              (err, _results) => {
                if (err) {
                  console.error("Lỗi khi cập nhật sách: " + err.stack);
                  rl.close();
                  return;
                }
                console.log(_results.affectedRows > 0);
                rl.close();
              }
            );
          });
        });
      });
    });
  });
  selectbooks();
}
selectbooks();
