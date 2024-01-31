
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
node server.js
```

For development with live reload:

```bash
npm start
```

### Usage 📘

After starting the server, you'll be able to access the API endpoints at `http://localhost:5500/api/v1/`. or `https://drab-pink-iguana.cyclic.app/api/v1/`

Endpoints include:
- `/users` for user management
- `/dishes` for dish management
- `/orders` for order management

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

