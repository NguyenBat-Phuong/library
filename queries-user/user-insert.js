const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function userInput() {
  rl.question("\nName: ", async (username) => {
    rl.question("Password: ", async (password) => {
      rl.question("email: ", async (email) => {
        rl.question("role: ", async (role) => {
          if (!username || !password || !email) {
            console.log("Cannot be left blank");
            userInput();
            return;
          }

          if (role !== "admin") {
            role = "user";
          }

          //INSERT Vao sql
          const query =
            "INSERT INTO users(username,password,email,role) VALUES (?,?,?,?)";
          const values = [username, password, email, role];
          await connection.promise().execute(query, values, (err, results) => {
            if (err) {
              console.error("ERROR INSERT USER VAO SQL: " + err.stack);
              return;
            }
            console.log("NEW USER:" + results);
          });
        });
      });
    });
  });
}

module.exports = {
  userInput,
};
