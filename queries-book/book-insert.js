const connection = require("../connect/db.js");
const inquirer = require("@inquirer/prompts");

async function question(promptText) {
  return inquirer.input({
    message: promptText,
  });
}

async function bookInsert() {
  try {
    const title = await question("Title: ");
    if (!title) {
      console.log("The title cannot be left blank");
      return;
    }
    const author = await question("Author: ");
    const category = await question("Category: ");
    const publishYear = await question("Publish Year: ");
    let status = await question("Status (default: available): ");
    if (
      status.toLowerCase() !== "borrowed" &&
      status.toLowerCase() !== "damaged"
    ) {
      status = "available";
    }

    if (isNaN(Number(publishYear))) {
      console.log("Năm xuất bản phải là một số.");
      return;
    }

    // Insert vào cơ sở dữ liệu
    const query = `
      INSERT INTO books (title, author, category, publish_year, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [title, author, category, publishYear, status];

    const [results] = await connection.promise().execute(query, values);

    console.log("New book inserted successfully:", results);
  } catch (err) {
    console.error("Error inserting book:", err.message);
  } finally {
    connection.end();
  }
}

module.exports = {
  bookInsert,
};
