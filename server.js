//---------
// PACKAGES
//---------

require("dotenv").config();
const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");
const bcrypt = require("bcrypt");

//-------------
// REPOSITORIES
//-------------

const chocolates = require("./src/repositories/chocolates");
const users = require("./src/repositories/users");
const contacts = require("./src/repositories/contacts");

//------------
// APPLICATION
//------------

const app = express();

//---------
// SESSIONS
//---------

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: "sessions-db.db" }),
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET || "DefaultSecret",
  }),
);

app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    console.log(
      `SESSION PASSED TO RESPONSE LOCALS: ${JSON.stringify(req.session)}`,
    );
    res.locals.session = req.session;
  }
  next();
});

//------------
// MIDDLEWARES
//------------

app.use((req, res, next) => {
  console.log(`Request METHOD and URL: ${req.method} : ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//------------
// VIEW ENGINE
//------------

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    partialsDir: path.join(__dirname, "src", "views", "partials"),
    helpers: {
      year: function () {
        return new Date().getFullYear();
      },
      repeat: function (n, options) {
        let result = "";
        for (let i = 0; i < n; i++) {
          result += options.fn(this, {
            data: {
              ...options.data,
              session: options.data.session,
            },
          });
        }
        return result;
      },
      range: (end) => Array.from({ length: end }, (_, i) => 1 + i),
      ifEquals: (a, b, options) =>
        a === b ? options.fn(this) : options.inverse(this),
    },
  }),
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

//------------------
// CHOCOLATES ROUTES
//------------------

// GET ALL
app.get("/chocolates", async (req, res, next) => {
  const currentPage = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (currentPage - 1) * limit;

  try {
    const totalChocolatesAvailable = await chocolates.getChocolatesCount();
    const totalPages = Math.ceil(totalChocolatesAvailable / limit);

    const chocolatesList = await chocolates.getChocolates(offset, limit);
    const model = {
      title: "Chocolates",
      chocolates: chocolatesList,
      currentPage,
      totalPages,
    };
    return res.render("chocolates", model);
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

// GET
app.get("/chocolates/:id", async (req, res, next) => {
  try {
    const chocolateItem = await chocolates.getChocolateById(req.params.id);

    if (!chocolateItem) {
      const err = new Error("Chocolate not found");
      err.status = 404;
      return next(err);
    }

    const imagesArray = chocolateItem.images
      ? chocolateItem.images.split(",")
      : [];

    const model = {
      title: chocolateItem.name,
      ...chocolateItem,
      images: imagesArray,
    };
    return res.render("chocolate", model);
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

// NEW OR MODIFY CHOCOLATE PAGE (ADMIN)
app.get("/chocolate/new", (req, res) => {
  if (req.session.isAdmin) {
    return res.render("chocolate-new", { title: "Add chocolate" });
  } else {
    return res.redirect("/");
  }
});

// ADD CHOCOLATE (ADMIN)
app.post("/chocolate/new", async (req, res, next) => {
  if (req.session.isAdmin) {
    try {
      const { name, description, cocoa_content, base_image, history } =
        req.body;
      await chocolates.addChocolate(
        name,
        description,
        cocoa_content,
        base_image,
        history,
      );
      return res.redirect("/chocolates");
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

// GET CHOCOLATE FOR MODIFICATION - NEW PAGE (ADMIN)
app.get("/chocolate/modify/:id", async (req, res, next) => {
  if (req.session.isAdmin) {
    try {
      const chocolateItem = await chocolates.getChocolateById(req.params.id);
      const model = { title: "Modify chocolate", ...chocolateItem };
      return res.render("chocolate-new", model);
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

// CHANGE CHOCOLATE (ADMIN)
app.post("/chocolate/modify/:id", async function (req, res, next) {
  if (req.session.isAdmin) {
    try {
      const { name, description, cocoa_content, base_image, history } =
        req.body;
      await chocolates.editChocolate(
        req.params.id,
        name,
        description,
        cocoa_content,
        base_image,
        history,
      );
      return res.redirect("/chocolates");
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

// DELETE
app.get("/chocolate/delete/:id", async function (req, res, next) {
  if (req.session.isAdmin) {
    try {
      await chocolates.deleteChocolate(req.params.id);
      return res.redirect("/chocolates");
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

//-------------
// USERS ROUTES
//-------------

// GET ALL (ADMIN)
app.get("/users", async function (req, res, next) {
  if (req.session.isAdmin) {
    try {
      const allUsers = await users.getUsers();
      const model = {
        title: "Users",
        users: allUsers,
      };
      return res.render("users", model);
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

// NEW OR MODIFY USER PAGE (ADMIN)
app.get("/user/new", (req, res) => {
  if (req.session.isAdmin) {
    return res.render("user-new", { title: "Add user" });
  } else {
    return res.redirect("/");
  }
});

// ADD USER (ADMIN)
app.post("/user/new", async (req, res, next) => {
  if (req.session.isAdmin) {
    try {
      const { firstname, lastname, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      await users.addUser(firstname, lastname, username, hashedPassword);
      return res.redirect("/users");
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

// GET USER FOR MODIFICATION - NEW PAGE (ADMIN)
app.get("/user/modify/:username", async (req, res, next) => {
  if (req.session.isAdmin) {
    try {
      const userItem = await users.getUserByUsername(req.params.username);
      const model = { title: "Modify user", ...userItem };
      return res.render("user-new", model);
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

// CHANGE USER (ADMIN)
app.post("/user/modify/:username", async function (req, res, next) {
  if (req.session.isAdmin) {
    try {
      const { id, firstname, lastname, username } = req.body;
      await users.editUser(id, firstname, lastname, username);
      return res.redirect("/users");
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

// DELETE
app.get("/user/delete/:id", async function (req, res, next) {
  if (req.session.isAdmin) {
    try {
      await users.deleteUser(req.params.id);
      return res.redirect("/users");
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    return res.redirect("/");
  }
});

//-------------
// AUTH ROUTES
//-------------

// LOGIN PAGE
app.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  } else {
    return res.render("login", { title: "Login" });
  }
});

// POST LOGIN
app.post("/login", async function (req, res, next) {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  } else {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME || "Admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!username || !password) {
      return res
        .status(400)
        .render("login", { error: "Username and password are required" });
    }

    try {
      if (username === adminUsername) {
        const isAdminPasswordCorrect = await bcrypt.compare(
          password,
          adminPassword,
        );

        if (!isAdminPasswordCorrect)
          return res
            .status(401)
            .render("login", { error: "Invalid credentials" });

        req.session.isAdmin = true;
        req.session.isLoggedIn = true;
        req.session.name = adminUsername;

        console.log(`ADMIN SESSION SET: ${JSON.stringify(req.session)}`);
        return res.redirect("/");
      }

      const user = await users.getUserByUsername(username);
      if (!user)
        return res.status(401).render("login", { error: "User not found" });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
        return res
          .status(401)
          .render("login", { error: "Invalid credentials" });

      req.session.isAdmin = false;
      req.session.isLoggedIn = true;
      req.session.name = user.firstname;

      console.log(`USER SESSION SET: ${JSON.stringify(req.session)}`);
      return res.redirect("/");
    } catch (err) {
      err.status = 500;
      next(err);
    }
  }
});

// REGISTER PAGE
app.get("/register", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  } else {
    return res.render("register", { title: "Register" });
  }
});

// POST REGISTER
app.post("/register", async (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  } else {
    const { firstname, lastname, username, password } = req.body;

    try {
      const existingUser = await users.getUserByUsername(username);

      if (existingUser) {
        return res.status(400).render("register", {
          error: "Username already taken",
        });
      }

      const hash = await bcrypt.hash(password, 12);
      await users.addUser(firstname, lastname, username, hash);

      req.session.isAdmin = false;
      req.session.isLoggedIn = true;
      req.session.name = firstname;

      console.log(`USER SESSION SET: ${JSON.stringify(req.session)}`);
      return res.redirect("/");
    } catch (err) {
      err.status = 500;
      next(err);
    }
  }
});

// LOGOUT
app.get("/logout", (req, res) => {
  if (req.session.isLoggedIn) {
    return req.session.destroy((err) => {
      if (err) {
        console.error(`Error while destroying the session ${err.message}`);
      } else {
        console.log("User logged out");
        res.redirect("/");
      }
    });
  } else {
    return res.render("/", { title: "Home" });
  }
});

//-------------
// APP ROUTES
//-------------

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// secret pages for admin? linus 5 TODO

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

app.post("/contact", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    await contacts.addContact(name, email, message);

    const model = { message: "Thank you for your message." };
    return res.render("contact", model);
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

app.get("/users", (req, res) => {
  res.render("users", { title: "Users" });
});

app.get("/img/favicon.png", (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.sendFile(path.join(__dirname, "public", "img", "favicon.png"));
});

app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  return next(err);
});

// ERROR HANDLER
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Set the default status code and message
  const status = err.status || 500;
  let message;

  switch (status) {
    case 400:
      message = "Bad Request: The server could not understand the request.";
      break;
    case 401:
      message = "Unauthorized: Please log in to access this resource.";
      break;
    case 403:
      message = "Forbidden: You do not have permission to access this page.";
      break;
    case 404:
      message =
        "Page Not Found: The page you are looking for might have been removed or is temporarily unavailable.";
      break;
    case 500:
      message =
        "Internal Server Error: An unexpected error occurred on the server.";
      break;
    default:
      message = "An unexpected error occurred. Please try again later.";
  }

  console.error(`Error ${status}: ${err.message}`);

  res.status(status).render("error", { message, status });
});

//-------
// LISTEN
//-------

const hostname = process.env.DEV_HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
  console.log(`Server running on port ${hostname}:${port}`);
});
