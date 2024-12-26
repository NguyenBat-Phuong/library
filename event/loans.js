const connection = require("../connect/db.js");
const inquirer = require("@inquirer/prompts");

// Hien thi danh sach các khoản vay (Loans)
async function selectLoans() {
  const sqlQuery = `
    SELECT 
      loans.id,
      loans.borrow_date,
      loans.return_date, 
      books.title,
      users.username
    FROM loans
    JOIN books ON loans.book_id = books.id
    JOIN users ON loans.user_id = users.id;
  `;

  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, results) => {
      if (err) {
        reject("ERROR SELECT LOANS: " + err.stack);
      } else {
        console.log(results);
        resolve(results);
      }
    });
  });
}

// Hàm để nhập thông tin từ người dùng
async function question(promptText) {
  return inquirer.input({
    message: promptText,
  });
}

// Them loan moi
async function insertLoans() {
  const return_date = await question("Return date (YYYY-MM-DD): ");
  const title = await question("Book title: ");
  const username = await question("Username: ");

  // title
  const bookQuery = "SELECT id FROM books WHERE title = ?";
  const [bookResults] = await connection.promise().query(bookQuery, [title]);

  // username
  const userQuery = "SELECT id FROM users WHERE username = ?";
  const [userResults] = await connection.promise().query(userQuery, [username]);

  if (bookResults.length === 0) {
    console.log("Book not found.");
    return;
  }
  if (userResults.length === 0) {
    console.log("User not found.");
    return;
  }

  // Insert loan
  const query =
    "INSERT INTO loans(return_date, book_id, user_id) VALUES (?, ?, ?)";
  const values = [return_date, bookResults[0].id, userResults[0].id];

  try {
    const [result] = await connection.promise().execute(query, values);
    console.log("Loan added successfully:", result);
  } catch (err) {
    console.error("ERROR INSERT LOAN: " + err.stack);
  }
}

async function loans() {
  await selectLoans();
  await insertLoans();
}

module.exports = {
  loans,
};
