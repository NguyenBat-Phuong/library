const inquirer = require("@inquirer/prompts");
const connection = require("../connect/db.js");
const bcrypt = require("bcrypt");

async function question(promptText) {
  return inquirer.input({
    message: promptText,
  });
}

async function userInput() {
  try {
    const saltRounds = 10; // Số vòng tính toán cho bcrypt
    const username = await question("Account: ");
    const password = await question("Password: ");
    const email = await question("Email: ");
    let role = await question("Role (admin/user): ");

    // Kiểm tra giá trị nhập
    if (!username || !password || !email) {
      console.log("Username, password, and email cannot be left blank.");
      return;
    }

    // Mặc định user
    if (role !== "admin") {
      role = "user"; // Default role
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Thêm người dùng vào cơ sở dữ liệu
    const query =
      "INSERT INTO users(username, password, email, role) VALUES (?, ?, ?, ?)";
    const values = [username, hashedPassword, email, role];
    const [results] = await connection.promise().execute(query, values);
    console.log("Done");
    console.log("New user inserted successfully:", results);
  } catch (err) {
    // promise bi tu choi
    console.error("Error inserting user:", err.message);
  } finally {
    connection.end();
  }
}
module.exports = {
  userInput,
};
