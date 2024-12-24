const connection = require("../connect/db.js");

function selectloans() {
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

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("ERROR SELECT LOANS: " + err.stack);
      return;
    }

    console.log("LOANS----------------------");
    console.log(results);
  });
}
selectloans();
