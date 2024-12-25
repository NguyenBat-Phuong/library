const inquirer = require("@inquirer/prompts");
const connection = require("../connect/db.js");

async function question(promptText) {
  return inquirer.input({
    message: promptText,
  });
}

async function userInput() {
  try {
    const username = await question("\nName: ");
    const password = await question("Password: ");
    const email = await question("Email: ");
    let role = await question("Role: ");

    if (!username || !password || !email) {
      console.log("Username, password, and email cannot be left blank.");
      return;
    }

    if (role !== "admin") {
      role = "user"; // Default role
    }

    // INSERT SQL
    const query = "INSERT INTO users(username, password, email, role) VALUES (?, ?, ?, ?)";
    const values = [username, password, email, role];
    const [results] = await connection.promise().execute(query, values);

    console.log("New user inserted successfully:", results);
  } catch (err) {
    console.error("Error inserting user:", err.message);
  } finally {
    connection.end();
  }
}

module.exports = {
  userInput,
};
