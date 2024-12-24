const { selectBooks } = require("./queries-book/book-select.js");
const { bookInsert } = require("./queries-book/book-insert.js");
const { deleteBook } = require("./queries-book/book-delete.js");
const { bookUpdate } = require("./queries-book/book-update.js");

const { userInput } = require("./queries-user/user-insert.js");
const { deleteUser } = require("./queries-user/user-delete.js");
const { whereUserID } = require("./queries-user/user-update.js");
const { permissions } = require("./queries-user/user-permissions.js");
const { selectUsers } = require("./queries-user/user-select.js");

async function main() {
  try {
    // console.log("Danh sách sách hiện tại:");
    // await selectBooks();

    await deleteBook();
    console.log("Xóa sách thành công!");

    // Nếu muốn hiển thị lại danh sách sách sau khi xóa:
    // console.log("Danh sách sách sau khi xóa:");
    // await selectBooks();
  } catch (err) {
    console.error("Lỗi khi xử lý sách:", err);
  }
}

main();
