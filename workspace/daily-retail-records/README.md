```markdown
# Daily Retail Records

Daily Retail Records is a React-based web application designed to streamline the process of tracking daily retail sales for an industrial hardware company. This app features a sophisticated user interface that allows employees and bosses to manage sales records efficiently, with functionalities such as adding, editing, and deleting sales, as well as exporting sales records for accounting purposes.

## Overview

The application utilizes a React frontend and a Node.js (Express) backend, with MongoDB serving as the database for storing user data, company lists, product lists, and sales records. The frontend is built with React to provide a dynamic and responsive user interface, communicating with the backend through RESTful API endpoints. Authentication and authorization are handled by the backend, distinguishing between employee and boss roles to control access to different functionalities. The backend manages user accounts, sales records, and provides endpoints for CRUD operations on sales records. MongoDB is used to store all the application data, making it a comprehensive solution for sales tracking.

### Project Structure

- Frontend: Developed with React, it includes components for user registration, login, and sales tracking functionalities. It utilizes axios for making HTTP requests and react-router-dom for routing.
- Backend: A Node.js application using Express for routing. It handles authentication, authorization, and CRUD operations on sales records. MongoDB is used for data storage, with Mongoose as an ODM.
- Technologies: Node.js, React, MongoDB, Express, axios, react-router-dom, Bootstrap for styling, jsonwebtoken for authentication, bcryptjs for password hashing, exceljs for exporting sales records to Excel files, and dotenv for managing environment variables.

## Features

- **User Authentication**: Secure login and registration system for employees and bosses.
- **Sales Tracking**: Employees can add, edit, and delete sales records. Bosses have additional access to manage employee permissions and view more detailed reports.
- **Dynamic Form Inputs**: For adding sales records, the app provides a dynamic form that suggests companies and products from the database.
- **Exporting Sales Records**: Crucial for accounting purposes, this feature allows for sales records to be downloaded as Excel files, marking them as processed.
- **Role-Based Access Control**: Differentiates between employee and boss roles, granting appropriate access levels and functionalities to each.

## Getting started

### Requirements

- Node.js and npm installed on your computer.
- MongoDB installed locally or accessible via a cloud service like MongoDB Atlas.

### Quickstart

1. Clone the repository to your local machine.
2. Navigate to the project directory and install backend dependencies:
   ```
   npm install
   ```
3. Navigate to the `client` directory and install frontend dependencies:
   ```
   cd client && npm install
   ```
4. Create a `.env` file in the root of the project and add your MongoDB URI and other environment variables as needed.
5. Start the backend server:
   ```
   npm start
   ```
6. In a new terminal window, start the React development server:
   ```
   cd client && npm start
   ```
7. The application should now be running on `http://localhost:3000`.

### License

Copyright (c) 2024.

This project is proprietary and not open source.
```