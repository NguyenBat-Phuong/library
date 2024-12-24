function selectUsers() {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("ERROR UPDATE USERS:" + err.stack);
    }
    console.log("USERS----------------------");
    console.log(results);
  });
}

module.exports = {
  selectUsers,
};