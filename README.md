# Chocolate Museum – Web Development Project

Welcome to the Chocolate Museum project! This is a web application that allows users to explore a virtual museum of chocolates. It includes features like viewing chocolate collections, learning about their history, and more.

**Note:** *This project is using browser-sync for live reloading, follow the scripts in CASE of development changes in ORDER!* \
**Note:** To test authentication:

- username: Admin
- password: admin123

## Screenshots
Here is a taste of how the web application looks like: \
– _photos taken with GoFullPage_

<div style="display: flex; flex-direction: row; gap: 10px;">
  <div style="display: flex; flex-direction: column; gap: 25px;">
    <img src="https://github.com/user-attachments/assets/8b43681f-b600-4c87-9e3a-c453aeabd3e9" alt="Chocolates Page" width="400" height="250"/>
    <img src="https://github.com/user-attachments/assets/36597185-e7aa-4a53-8a94-c851486874f8" alt="Details Page" width="400" height="250"/>
  </div>
  <div style="display: flex; flex-direction: column; gap: 25px;">
    <img src="https://github.com/user-attachments/assets/3520b05b-3b8a-463b-81f4-31528dbc9911" alt="Login Page" width="400" height="250"/>
    <img src="https://github.com/user-attachments/assets/15fe29ba-97ec-4e5a-bdbf-d16a6937fdf6" alt="Register Page" width="400" height="250"/>
  </div>
  <img src="https://github.com/user-attachments/assets/de523866-81f2-47d6-b446-1c460cfda6ea" alt="Contact Page" width="400" height="250"/>
</div>

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
The server will reload when you make changes.

### `npm run ui`

**OBS:** *This script should run last!* \
Automatically reloads the browser when you make changes. \
Browser-sync will proxy current running server. \
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

**HINT:** If the port is wrong, check the terminal running browser-sync to land right! 

### `/* Happy Coding! */`
