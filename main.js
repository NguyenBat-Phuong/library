const { selectBooks } = require("./queries-book/book-select.js");
const { bookInsert } = require("./queries-book/book-insert.js");
const { deleteBook } = require("./queries-book/book-delete.js");
const { bookUpdate } = require("./queries-book/book-update.js");

const { userInput } = require("./queries-user/user-insert.js");
const { deleteUser } = require("./queries-user/user-delete.js");
const { whereUserID } = require("./queries-user/user-update.js");
const { permissions } = require("./queries-user/user-permissions.js");
const { selectUsers } = require("./queries-user/user-select.js");

const inquirer = require("@inquirer/prompts");

async function main() {
  try {
    while (true) {
      // Hiển thị menu lựa chọn
      const action = await inquirer.select({
        message: "Chọn hành động muốn thực hiện:",
        choices: [
          { name: "Hiển thị danh sách sách", value: "selectBooks" },
          { name: "Thêm sách mới", value: "bookInsert" },
          { name: "Xóa sách", value: "deleteBook" },
          { name: "Cập nhật sách", value: "bookUpdate" },
          { name: "Hiển thị danh sách người dùng", value: "selectUsers" },
          { name: "Thêm người dùng", value: "userInput" },
          { name: "Xóa người dùng", value: "deleteUser" },
          { name: "Thoát", value: "exit" },
        ],
      });

      // Xử lý lựa chọn
      switch (action) {
        case "selectBooks":
          await selectBooks();
          break;
        case "bookInsert":
          await bookInsert();
          break;
        case "deleteBook":
          await deleteBook();
          break;
        case "bookUpdate":
          await bookUpdate();
          break;
        case "selectUsers":
          await selectUsers();
          break;
        case "userInput":
          await userInput();
          break;
        case "deleteUser":
          await deleteUser();
          break;
        case "exit":
          console.log("Đã thoát chương trình.");
          return;
        default:
          console.log("Lựa chọn không hợp lệ. Vui lòng thử lại.");
      }
    }
  } catch (err) {
    console.error("Lỗi khi xử lý:", err.message);
  }
}

main();
