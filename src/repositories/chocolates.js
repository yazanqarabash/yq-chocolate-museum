const db = require("../../db");

function getChocolatesCount() {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as count FROM chocolates`, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

function getChocolates(offset, limit) {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT id, name, description, cocoa_content, base_image, history
      FROM chocolates LIMIT ? OFFSET ?
    `,
      [limit, offset],
      (err, rows) => {
        if (err) {
          console.error("Error retrieving chocolates:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
}

function getChocolateById(id) {
  const query = `
      SELECT chocolates.id, chocolates.name, chocolates.description, chocolates.cocoa_content, base_image, history,
      GROUP_CONCAT(DISTINCT chocolate_images.image_url) AS images
      FROM chocolates
      LEFT JOIN chocolate_images ON chocolates.id = chocolate_images.chocolate_id
      WHERE chocolates.id = ?
      GROUP BY chocolates.id
    `;
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error(`Error retrieving chocolate with id ${id}:`, err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function addChocolate(name, description, cocoa_content, base_image, history) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO chocolates (name, description, cocoa_content, base_image, history) VALUES (?, ?, ?, ?, ?)",
      [name, description, cocoa_content, base_image, history],
      (err) => {
        if (err) {
          console.error("Error adding chocolate:", err);
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

function editChocolate(
  id,
  name,
  description,
  cocoa_content,
  base_image,
  history,
) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE chocolates SET name = ?, description = ?, cocoa_content = ?, base_image = ?, history = ? WHERE id = ?",
      [name, description, cocoa_content, base_image, history, id],
      (err) => {
        if (err) {
          console.error("Error editing chocolate:", err);
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

function deleteChocolate(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM chocolates WHERE id = (?)", id, (err) => {
      if (err) {
        console.error("Error deleting chocolate:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  getChocolatesCount,
  getChocolates,
  getChocolateById,
  addChocolate,
  editChocolate,
  deleteChocolate,
};
