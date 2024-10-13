//---------
// PACKAGES
//---------

const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

//--------------------
// DATABASE CONNECTION
//--------------------

const db = new sqlite3.Database(
  "./database/chocolate-museum.sqlite3.db",
  (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to SQLite database");
    }
  },
);

function handleError(err) {
  if (err) {
    console.error("SQL error:", err.message);
  }
}

//--------------
// CREATE TABLES
//--------------

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT,
    lastname TEXT,
    username TEXT UNIQUE,
    password TEXT
  )`,
    handleError,
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS chocolates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      cocoa_content INTEGER,
      base_image TEXT,
      history TEXT
    )`,
    handleError,
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS chocolate_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    chocolate_id INTEGER,
    FOREIGN KEY(chocolate_id) REFERENCES chocolates(id)
  )`,
    handleError,
  );

  //------------
  // FILL TABLES
  //------------

  db.get("SELECT COUNT(*) AS count FROM chocolates", (err, countRow) => {
    if (countRow.count === 0) {
      const chocolates = [
        {
          name: "Rich Dark Delight",
          description:
            "New now! Discover our dark fine flavor cocoa chocolate made from the finest beans. With intense cocoa content, this delight has a hint of tropical and earthy notes and is vegan-friendly. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer luctus, sapien at malesuada placerat, eros augue auctor turpis, vitae interdum sem lectus nec erat. Sed eget nulla ut leo vulputate suscipit. Fusce venenatis justo at magna pretium, vitae efficitur nulla.",
          cocoa_content: 78,
          base_image: "dark_chocolate.webp",
          history:
            "An ode to untouched nature and the intense taste of fine cocoa. This premium chocolate invites you to an incomparable sensory experience, where the purity of cocoa and its diverse aromas take center stage. Every bite offers pure cocoa pleasure and literally melts in your mouth. An ode to lorem ipsum and its timeless charm, this blend celebrates the art of pseudo-Latin text. Each phrase is crafted with precision to deliver an experience that’s both unique and memorable. A must-read for those who seek depth and creativity in every line.",
        },
        {
          name: "Smooth Milk Wonder",
          description:
            "Indulge in our milk chocolate crafted with select cocoa beans and the finest milk. It melts into a smooth, creamy delight, perfect for a moment of sweet relaxation. Discover the world of lorem ipsum, where text meets elegance and charm. This selection showcases the best of pseudo-Latin, giving a tropical vibe with its smooth syntax. Rich and vegan-friendly, it delivers a taste of creativity and a hint of ancient Roman heritage.",
          cocoa_content: 34,
          base_image: "milk_chocolate.webp",
          history:
            "A tribute to the art of milk chocolate making, where the harmony of creamy milk and fine cocoa creates a smooth, luscious treat that soothes the senses. Lorem ipsum has long been revered for its mysterious allure. This blend brings out the best of its qualities, offering a sensory experience that’s as rich as it is captivating. Every word is carefully chosen to create a reading experience that’s unforgettable.",
        },
        {
          name: "Velvety White Dream",
          description:
            "Treat yourself to our white chocolate bar with subtle hints of vanilla. Crafted to perfection, it's a smooth experience with each bite, ideal for those seeking a sweet escape. A new experience awaits! Enter the realms of lorem ipsum, with a unique blend of words that takes you to uncharted territories. This is the finest lorem ipsum blend, curated with care. It’s as engaging as it is vegan, with a tropical flair and hints of nostalgia.",
          cocoa_content: 0,
          base_image: "white_chocolate.webp",
          history:
            "A celebration of the delicate nature of white chocolate, crafted with pure cocoa butter and infused with vanilla for a soft, creamy texture. This unique lorem ipsum blend takes you on a journey through the ages. With each line, it unveils a story steeped in history and intrigue. It’s a tribute to the ancient art of text crafting, where every sentence serves as a window into a world of endless possibilities.",
        },
        {
          name: "Hazelnut Harmony",
          description:
            "Savor the perfect balance of rich cocoa and crunchy hazelnuts in this delightful chocolate bar, crafted for nut lovers everywhere. Experience the ultimate lorem ipsum flavor blend! Made with words crafted from ancient Latin, this text is for the discerning reader with a taste for pseudo-classical design. Every sentence delivers a rich, vegan experience, with a smooth structure and hints of mystery.",
          cocoa_content: 34,
          base_image: "hazelnut_chocolate.webp",
          history:
            "This blend of hazelnuts and chocolate brings together two classic flavors for an irresistible combination, capturing the heart of traditional chocolate making. Embark on a journey of discovery with this rich lorem ipsum blend. Each phrase is crafted to perfection, offering a reading experience that’s both intense and immersive. It’s a tribute to the art of text crafting, where each word holds a world of meaning.",
        },
        {
          name: "Minty Fresh Fusion",
          description:
            "Experience the refreshing taste of mint combined with rich chocolate in a bar that’s perfect for those who crave a fresh, cool flavor. Introducing a fine blend of lorem ipsum and classical Latin vibes! This premium text features bold syntax and a touch of elegance. It’s rich in character, vegan by nature, and perfect for those who appreciate the finer nuances of lorem ipsum creativity.",
          cocoa_content: 47,
          base_image: "mint_chocolate.webp",
          history:
            "A refreshing twist on classic chocolate, this bar blends cool mint with rich cocoa, offering a delightful experience for the senses. Experience the classic allure of lorem ipsum with this unique blend. Every line invites you to savor the rich flavors of pseudo-Latin, with hints of ancient Roman elegance. This is more than just text—it’s a journey through time and syntax, crafted to perfection.",
        },
        {
          name: "Rich Dark Delight",
          description:
            "New now! Discover our dark fine flavor cocoa chocolate made from the finest beans. With intense cocoa content, this delight has a hint of tropical and earthy notes and is vegan-friendly. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer luctus, sapien at malesuada placerat, eros augue auctor turpis, vitae interdum sem lectus nec erat. Sed eget nulla ut leo vulputate suscipit. Fusce venenatis justo at magna pretium, vitae efficitur nulla.",
          cocoa_content: 78,
          base_image: "dark_chocolate.webp",
          history:
            "An ode to untouched nature and the intense taste of fine cocoa. This premium chocolate invites you to an incomparable sensory experience, where the purity of cocoa and its diverse aromas take center stage. Every bite offers pure cocoa pleasure and literally melts in your mouth. An ode to lorem ipsum and its timeless charm, this blend celebrates the art of pseudo-Latin text. Each phrase is crafted with precision to deliver an experience that’s both unique and memorable. A must-read for those who seek depth and creativity in every line.",
        },
        {
          name: "Smooth Milk Wonder",
          description:
            "Treat yourself to our white chocolate bar with subtle hints of vanilla. Crafted to perfection, it's a smooth experience with each bite, ideal for those seeking a sweet escape. Discover the world of lorem ipsum, where text meets elegance and charm. This selection showcases the best of pseudo-Latin, giving a tropical vibe with its smooth syntax. Rich and vegan-friendly, it delivers a taste of creativity and a hint of ancient Roman heritage.",
          cocoa_content: 34,
          base_image: "milk_chocolate.webp",
          history:
            "A tribute to the art of milk chocolate making, where the harmony of creamy milk and fine cocoa creates a smooth, luscious treat that soothes the senses. Lorem ipsum has long been revered for its mysterious allure. This blend brings out the best of its qualities, offering a sensory experience that’s as rich as it is captivating. Every word is carefully chosen to create a reading experience that’s unforgettable.",
        },
        {
          name: "Velvety White Dream",
          description:
            "Indulge in our white chocolate made from premium cocoa butter, complemented with hints of natural vanilla for a truly decadent experience. A new experience awaits! Enter the realms of lorem ipsum, with a unique blend of words that takes you to uncharted territories. This is the finest lorem ipsum blend, curated with care. It’s as engaging as it is vegan, with a tropical flair and hints of nostalgia.",
          cocoa_content: 0,
          base_image: "white_chocolate.webp",
          history:
            "A celebration of the delicate nature of white chocolate, crafted with pure cocoa butter and infused with vanilla for a soft, creamy texture. This unique lorem ipsum blend takes you on a journey through the ages. With each line, it unveils a story steeped in history and intrigue. It’s a tribute to the ancient art of text crafting, where every sentence serves as a window into a world of endless possibilities.",
        },
        {
          name: "Hazelnut Harmony",
          description:
            "Savor the perfect balance of rich cocoa and crunchy hazelnuts in this delightful chocolate bar, crafted for nut lovers everywhere. Experience the ultimate lorem ipsum flavor blend! Made with words crafted from ancient Latin, this text is for the discerning reader with a taste for pseudo-classical design. Every sentence delivers a rich, vegan experience, with a smooth structure and hints of mystery.",
          cocoa_content: 34,
          base_image: "hazelnut_chocolate.webp",
          history:
            "This blend of hazelnuts and chocolate brings together two classic flavors for an irresistible combination, capturing the heart of traditional chocolate making. Embark on a journey of discovery with this rich lorem ipsum blend. Each phrase is crafted to perfection, offering a reading experience that’s both intense and immersive. It’s a tribute to the art of text crafting, where each word holds a world of meaning.",
        },
      ];

      chocolates.forEach((chocolate) => {
        db.run(
          "INSERT INTO chocolates (name, description, cocoa_content, base_image, history) VALUES (?, ?, ?, ?, ?)",
          [
            chocolate.name,
            chocolate.description,
            chocolate.cocoa_content,
            chocolate.base_image,
            chocolate.history,
          ],
        );
      });
    }
  });

  db.get("SELECT COUNT(*) AS count FROM chocolate_images", (err, countRow) => {
    if (countRow.count === 0) {
      const chocolateImages = [
        { image_url: "dark_chocolate_1.webp", chocolate_id: 1 },
        { image_url: "dark_chocolate_2.webp", chocolate_id: 1 },
        { image_url: "milk_chocolate_1.webp", chocolate_id: 2 },
        { image_url: "milk_chocolate_2.webp", chocolate_id: 2 },
        { image_url: "white_chocolate_1.webp", chocolate_id: 3 },
        { image_url: "white_chocolate_2.webp", chocolate_id: 3 },
        { image_url: "hazelnut_chocolate_1.webp", chocolate_id: 4 },
        { image_url: "hazelnut_chocolate_2.webp", chocolate_id: 4 },
        { image_url: "mint_chocolate_1.webp", chocolate_id: 5 },
      ];

      chocolateImages.forEach((img) => {
        db.run(
          "INSERT INTO chocolate_images (image_url, chocolate_id) VALUES (?, ?)",
          [img.image_url, img.chocolate_id],
        );
      });
    }
  });

  //---------------
  // ADMIN CREATION
  //---------------

  db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (row.count === 0) {
      const firstname = "Yazan";
      const lastname = "Qarabash";
      const username = "yazan";
      const password = "admin123";

      bcrypt.hash(password, 12, (err, hash) => {
        if (err) {
          console.log("Error hashing password:", err);
        } else {
          console.log("Hashed password:", hash);
          db.run(
            "INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)",
            [firstname, lastname, username, hash],
            function (err) {
              if (err) {
                console.error(
                  `ERROR: could not insert admin user: ${err.message}`,
                );
              } else {
                console.log("Admin user inserted");
              }
            },
          );
        }
      });
    } else {
      console.log("Admin user already exists, no need to insert.");
    }
  });
});

module.exports = db;
