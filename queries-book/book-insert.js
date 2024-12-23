const readline = require("readline");
const connection = require("../db.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function selectbooks() {
  connection.query("SELECT * FROM books", (err, results) => {
    if (err) {
      console.error("ERROR SELECT BOOKS:" + err.stack);
    }
    console.log("BOOKS----------------------");
    console.log(results);
    bookInput();
  });
}
async function deleteBooks() {
  connection.query("DROP TABLE IF EXISTS books", async (err) => {
    if (err) {
      console.error("ERROR DROP TABLE BOOKS: " + err.stack);
      return;
    }
    console.log("Table 'books' deleted successfully.");

    try {
      await bookInput(); // Đảm bảo chạy sau khi bảng bị xóa
    } catch (error) {
      console.error("Error calling bookInput():", error);
    }
  });
}

async function bookInput() {
  rl.question("\nTitle: ", (title) => {
    rl.question("Author: ", (author) => {
      rl.question("Category: ", (category) => {
        rl.question("Publish_year: ", (publish_year) => {
          rl.question("Status: ", async (status) => {
            if (!title) {
              console.log("The title cannot be left blank");
              bookInput();
              return;
            }

            if (status !== "borrowed" && status !== "damaged") {
              status = "available";
            }

            //INSERT Vao sql
            const query =
              "INSERT INTO books(title,author,category,publish_year,status) VALUES (?,?,?,?,?)";
            const values = [title, author, category, publish_year, status];

            await connection
              .promise()
              .execute(query, values, (err, results) => {
                if (err) {
                  console.error("ERROR INSERT USER VAO SQL: " + err.stack);
                  return;
                }
                console.log("NEW USER:" + results);
                connection.end;
              });
          });
        });
      });
    });
  });
}

selectbooks();

module.exports = {
  bookInput,
  selectbooks,
};
