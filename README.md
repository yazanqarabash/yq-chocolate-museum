# Chocolate Museum – Web Development Project

Welcome to the Chocolate Museum project! This is a web application that allows users to explore a virtual museum of chocolates. It includes features like viewing chocolate collections, learning about their history, and more.

**Note:** *This project is using browser-sync for live reloading, follow the scripts in CASE of development changes in ORDER!* \
**Note:** To test authentication: \
username: Admin \
password: admin123
- - -


## Setup Scripts


Before running the project, make sure to install all dependencies by running:
### `npm install`

In the project directory, you should run:

### `npm run tailwind:css`

Scans template files for classes, builds the CSS and add it to `styles.css` used in `main.handlebars`. \
See the section about tailwindcss [installation](https://tailwindcss.com/docs/installation) for more information.

### `npm start`

Runs the app using nodemon in the development mode. \
Server runs on **localhost:3000**, but since we are using browser-sync it will use proxy mode. \
The server will reload when you make changes. \

### `npm run ui`

**OBS:** *This script should run last!* \
Automatically reloads the browser when you make changes. \
Browser-sync will proxy current running server. \
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

**HINT:** If the port is wrong, check the terminal running browser-sync to land right! 

### `/* Happy Coding! */`