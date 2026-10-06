# Brush and Bid

Brush and Bid is a web-based art auction platform that allows users to explore artworks, participate in auctions, place bids, and manage the auction process. The project includes both a user-facing website and an admin system for managing artworks, auctions, bids, shipping, and payments.

## Features

* User registration and login
* Browse and view artworks
* Artist artwork pages
* Auction scheduling and management
* Place bids on active artworks
* View bidding history
* Automatic auction status handling
* Winner identification after auction completion
* Shipping details management
* Payment status management
* Admin dashboard
* Artwork and auction management
* Auction reports
* My Bids section

## Technologies Used

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Other Technologies

* Nodemailer
* bcrypt
* CORS

## Project Structure

```text
Brush-and-Bid/
│
├── HTML Pages
├── CSS Files
├── JavaScript Files
├── server.js
├── brush_and_bid.sql
└── README.md
```

## Team Members / Collaborators

* **iamnavyagowda** – Frontend development and HTML pages
* **sharonn-308** – Frontend development and HTML pages
* **supritharaju550-gif** – Backend development, server-side functionality and SQL database
* **joantt3012-afk** – Backend development, server-side functionality and SQL database

## Contribution

### Frontend

**Navya (iamnavyagowda)** and **Sharon (sharonn-308)** worked on the HTML pages and frontend structure of the Brush and Bid website.

### Backend and Database

**Supritha (supritharaju550-gif)** and **Joan (joantt3012-afk)** worked on the server-side implementation, API connections, backend functionality, and SQL database.

## How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/brush-and-bid.git
```

### 2. Open the project folder

```bash
cd brush-and-bid
```

### 3. Install the required Node.js packages

```bash
npm install
```

### 4. Set up the MySQL database

Import the provided SQL file:

```text
brush_and_bid.sql
```

### 5. Configure the database

Update the MySQL connection details in `server.js` according to your local MySQL setup.

### 6. Start the server

```bash
node server.js
```

### 7. Open the application

Open the following URL in your browser:

**http://localhost:3000**

## Database

The project uses **MySQL** to store and manage:

* User accounts
* Artist information
* Artwork details
* Auctions
* Bids
* Shipping details
* Payment status
* Auction results
* Admin-related information

## Purpose

The project was developed as a web-based platform to demonstrate how an online art auction system can be implemented using frontend technologies, a Node.js backend, and a MySQL database.

