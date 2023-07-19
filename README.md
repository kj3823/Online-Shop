# Online-Shop
This repository contains the source code for an online shop built using Node.js. The application allows users to browse and purchase products, manage their shopping cart, and complete the checkout process. It is designed to be a simple and lightweight e-commerce solution.

## Features
- User registration and authentication
- Browse and search products
- Add products to the shopping cart
- Update and remove items from the shopping cart
- Complete the checkout process with payment integration
- Order history and status tracking
- Admin panel for managing products and orders

## Prerequisites
Before running the application, ensure you have the following prerequisites installed on your machine:

- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (v4.0.0 or higher)

## Getting Started
1. Clone the repository:

```
git clone https://github.com/your-username/online-shop-nodejs.git
```
2. Navigate to the project directory:
```
cd online-shop-nodejs
```
3. Install the dependencies:
```
npm install
```
4.Configure the application:
- Create a .env file in the project root directory.
- Copy the contents of .env.example into .env.
- Modify the values in .env to match your environment configuration (e.g., database connection string, session secret, etc.).
5. Start the application:
```
npm start
```
The application should now be running on http://localhost:3000.

6. Open your web browser and navigate to http://localhost:3000 to access the online shop.

## Project Structure
The project follows a standard Node.js application structure with the main files and directories as follows:

- app.js: Entry point of the application where the server is created and middleware are configured.
- config/: Directory containing configuration files, including database connection setup, session configuration, etc.
- controllers/: Directory containing the route controllers for handling HTTP requests and responses.
- models/: Directory containing the Mongoose models representing the data schema for products, users, and orders.
- public/: Directory containing static assets such as CSS stylesheets, client-side JavaScript files, and images.
- routes/: Directory containing route definitions for different parts of the application.
- views/: Directory containing the EJS templates for rendering dynamic HTML pages.
- middlewares/: Directory containing custom middleware functions.
- helpers/: Directory containing helper functions used throughout the application.
- seed/: Directory containing seed data for populating the initial database with products.

## Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them with descriptive commit messages.
- Push your changes to your forked repository.
- Submit a pull request, explaining the changes you made and why they should be merged.

## Acknowledgements
- Express
- MongoDB
- Mongoose
- Stripe
