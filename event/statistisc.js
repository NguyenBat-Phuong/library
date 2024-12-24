const connection = require("../connect/db.js");

function selectStatistics() {
  const sqlQuery = `
    SELECT book_id, COUNT(*) AS borrow_count
    FROM loans
    GROUP BY book_id
    ORDER BY borrow_count DESC
  `;
  
  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("ERROR SELECT statistics:" + err.stack);
      return;
    }
    console.log("Book Ranking----------------------");
    results.forEach((row, index) => {
      console.log(`${index + 1}. Book ID: ${row.book_id}, Borrow Count: ${row.borrow_count}`);
    });
  });
}

selectStatistics();
