const connection = require("../connect/db.js");

function selectBooks() {
  connection.query("SELECT * FROM books", (err, results) => {
    if (err) {
      console.error("ERROR SELECT BOOKS: " + err.stack);
      return;
    }
    console.log("BOOKS----------------------");
    console.log(results);

    // Đóng kết nối
    connection.end((closeErr) => {
      if (closeErr) {
        console.error("ERROR CLOSING CONNECTION: " + closeErr.stack);
      } else {
        console.log("Connection closed successfully.");
      }
    });
  });
}
module.exports = {
  selectBooks,
};
