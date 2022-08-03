const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

mongoose
  .connect(
    "mongodb+srv://djeffsparrow:" +
      process.env.DB_USER_PASS +
      "@cluster0.u0mr7.mongodb.net/mern-project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log("Failed to connect to mongoDB ", err));
