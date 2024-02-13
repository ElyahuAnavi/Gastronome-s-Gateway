
---

# 🌟 Gastronome's Gateway: Restaurant Reservation System 🍽️
---
Welcome to **Gastronomes Gateway**, a state-of-the-art restaurant reservation system designed to streamline the process of booking tables and managing orders. Built with Node.js and MongoDB, our platform ensures a seamless, efficient, and secure dining experience for both customers and restaurant staff.

## Getting Started 🚀

Follow these instructions to get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites 📋

Before you dive in, make sure you have the following software installed:

- [Node.js](https://nodejs.org/en/download/) (v10.0.0 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (Follow the installation guide for your system)
- [Git](https://git-scm.com/downloads) (Optional, for cloning the repository)

### Installation 🔧

1. **Clone the repository:**

```bash
git clone https://github.com/elyahu631/Gastronome-s-Gateway.git
cd gastronomes-gateway
```

2. **Install NPM packages:**

```bash
npm install
```

3. **Set up your environment variables:**

Create a `.env` file in the root directory and fill it with your environment-specific details:

```dotenv
DATABASE=mongodb+srv://your_mongodb_uri
DATABASE_PASSWORD=your_database_password
PORT=3000
NODE_ENV=development
EMAIL_HOST=smtp.your-email-service.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
```

4. **Start the server:**

```bash
npm start
```

For development with live reload:

```bash
npm run dev
```

### Usage 📘

After starting the server, you'll be able to access the API endpoints at `http://localhost:5500/api/v1/`. or `https://drab-pink-iguana.cyclic.app/api/v1/`

Endpoints include:
- `/users` for user management
- `/dishes` for dish management
- `/orders` for order management
---

## API Endpoints 🚏

**Gastronomes Gateway** provides a set of RESTful endpoints for managing users, dishes, and orders within the system. Here's a quick guide to what each route does:

### User Management 🧑‍🤝‍🧑

- `POST /api/v1/users/signup` - Register a new user.
- `POST /api/v1/users/login` - Log in an existing user.
- `GET /api/v1/users/logout` - Log out the current user.
- `POST /api/v1/users/forgotPassword` - Request a password reset link.
- `PATCH /api/v1/users/resetPassword/:token` - Reset password using the token received via email.
- `PATCH /api/v1/users/updateMyPassword` - Allows logged-in users to change their password.
- `GET /api/v1/users/me` - Fetch the profile of the logged-in user.
- `PATCH /api/v1/users/updateMe` - Update profile details of the logged-in user.
- `DELETE /api/v1/users/deleteMe` - Soft-delete the logged-in user's account.
- `GET /api/v1/users/` - (Admin only) Get a list of all users.
- `POST /api/v1/users/` - (Admin only) Create a user.
- `GET /api/v1/users/:id` - (Admin only) Get a specific user by ID.
- `PATCH /api/v1/users/:id` - (Admin only) Update a user by ID.
- `DELETE /api/v1/users/:id` - (Admin only) Delete a user by ID.

### Dish Management 🍲

- `GET /api/v1/dishes/` - Get a list of all dishes. Supports filtering, sorting, and pagination.
- `POST /api/v1/dishes/` - (Admin only) Create a new dish.
- `GET /api/v1/dishes/top-5-dishes` - Get the top 5 dishes based on ratings.
- `GET /api/v1/dishes/:id` - Get a specific dish by ID.
- `PATCH /api/v1/dishes/:id` - (Admin only) Update a dish by ID.
- `DELETE /api/v1/dishes/:id` - (Admin only) Delete a dish by ID.

### Order Management 📦

- `POST /api/v1/orders/` - Create a new order.
- `GET /api/v1/orders/` - Get all orders placed by the logged-in user.
- `GET /api/v1/orders/all` - (Admin only) Get a list of all orders in the system.
- `GET /api/v1/orders/top-customers` - (Admin only) Get top customers based on the number of orders placed.
- `GET /api/v1/orders/top-day-last-month` - (Admin only) Get the day with the highest sales in the last month.
- `GET /api/v1/orders/:id` - Get details of a specific order by ID.
- `PATCH /api/v1/orders/:id` - (Admin only) Update the status of an order by ID.

---

## Built With 🛠️

- [Node.js](https://nodejs.org/) - The server runtime
- [Express](https://expressjs.com/) - Web application framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - Object Data Modeling (ODM) library
- [Nodemailer](https://nodemailer.com/about/) - Module for email sending

## License 📄

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments 🎉
- Special thanks to the Node.js community for the invaluable resources.

---

