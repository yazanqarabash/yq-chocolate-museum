const db = require("../../db");

function getUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        console.error(`Error fetching users: ${err.message}`);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username=(?)", [username], (err, row) => {
      if (err) {
        console.error(
          `Error fetching user by username ${username}:`,
          err.message,
        );
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function addUser(firstname, lastname, username, hash) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (firstname, lastname, username, password) VALUES (?, s?, ?, ?)",
      [firstname, lastname, username, hash],
      (err) => {
        if (err) {
          console.error(`Error adding user: ${err.message}`);
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

function editUser(id, firstname, lastname, username, hash) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET firstname = (?), lastname = (?), username = (?), password = (?) WHERE id = (?)",
      [firstname, lastname, username, hash, id],
      (err) => {
        if (err) {
          console.error(`Error updating user with id ${id}:`, err.message);
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM users WHERE id = (?)", [id], (err) => {
      if (err) {
        console.error(`Error deleting user with id ${id}:`, err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  getUsers,
  getUserByUsername,
  addUser,
  editUser,
  deleteUser,
};
