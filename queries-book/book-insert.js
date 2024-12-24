const readline = require("readline");
const connection = require("../connect/db.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function bookInsert() {
  rl.question("\nTitle: ", (title) => {
    rl.question("Author: ", (author) => {
      rl.question("Category: ", (category) => {
        rl.question("Publish_year: ", (publish_year) => {
          rl.question("Status: ", async (status) => {
            if (!title) {
              console.log("The title cannot be left blank");
              bookInsert();
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
                connection.end();
              });
          });
        });
      });
    });
  });
}
module.exports = {
  bookInsert,
};
