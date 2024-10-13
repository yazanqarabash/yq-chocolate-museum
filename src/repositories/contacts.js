const db = require("../../db");

function addContact(name, email, message) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message],
      (err) => {
        if (err) {
          console.error("Error saving message:", err);
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

module.exports = { addContact };
