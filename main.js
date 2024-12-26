const { selectBooks } = require("./queries-book/book-select.js");
const { bookInsert } = require("./queries-book/book-insert.js");
const { deleteBook } = require("./queries-book/book-delete.js");
const { updateBook } = require("./queries-book/book-update.js");
const { userInput } = require("./queries-user/user-insert.js");
const { deleteUser } = require("./queries-user/user-delete.js");
const { updateUser } = require("./queries-user/user-update.js");
const { selectUsers } = require("./queries-user/user-select.js");
const { permissions } = require("./queries-user/user-permissions.js");
const { loans } = require("./event/loans.js");
const { loginUser } = require("./login/log-in.js");
const inquirer = require("@inquirer/prompts");

async function main() {
  try {
    console.log("Chào mừng đến với hệ thống quản lý thư viện!");

    // Đăng nhập trước khi tiếp tục
    // await loginUser();
    await permissions();
    // await loans();
  } catch (err) {
    console.error("Đã xảy ra lỗi:", err.message);
  }
}

main();
