# 🗺️ Wanderlust - Lodging Marketplace

Welcome to **Wanderlust**, my very first full-stack backend application! This project functions as a dynamic lodging marketplace allowing users to list, browse, and review diverse accommodations.

## 🚀 Features

- **Listing Management:** Create, Read, Update, and Delete (CRUD) rental listings with prices and locations.
- **Review System:** Users can submit and delete feedback ratings for specific accommodations.
- **Database Integration:** Scalable NoSQL schema built on MongoDB using Mongoose.
- **MVC Architecture:** Neatly structured routes, controllers, layout templates, and models.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ORM
- **Templating Engine:** EJS (Embedded JavaScript) with EJS-Mate layouts
- **Styling:** Custom CSS, Bootstrap

## 📂 Project Structure

```text
├── models/         # Database models (Listing, Review, User)
├── routes/         # Express router endpoints
├── public/         # Static assets (CSS, client-side JS)
├── views/          # EJS user interface layouts and pages
└── app.js          # Main server initialization file
```

## ⚙️ How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/zaheerBuilds/wanderlust.git
   ```
2. Navigate into the directory and install dependencies:
   ```bash
   cd wanderlust
   npm install
   ```
3. Initialize the default listings dataset:
   ```bash
   node init/index.js
   ```
4. Start your Express server:
   ```bash
   node app.js
   ```
5. Open `http://localhost:8080` (or your chosen PORT) in your browser!
