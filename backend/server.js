// import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import appRoutes from "./routes/app.routes.js";
import jobRoutes from "./routes/job.routes.js";
import languageCostRoutes from "./routes/languagecost.routes.js";
import notification from "./routes/notification.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
// import { app, server } from "./socket/socket.js";

// payment gateway
import Stripe from "stripe";
const stripe = new Stripe(process.env.PAYMENT_SECRET_KEY,{
  apiVersion: '2020-08-27',
});

import cors from "cors";

const app = express();
app.use(cors());

//  it will give the current root directory name
// const __dirname = path.resolve();

dotenv.config();

app.use(express.json()); // to parse the body of the request
app.use(cookieParser()); // to parse the cookies

const PORT = process.env.PORT || 5000;
// node mailer for sending email //it's need to create in root directory.otherwise it will not work
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

app.get("/", (req, res) => {
  // root route
  res.send(`Root API is running.... ${PORT}`);
});
app.get("/check", (req, res) => {
  // root route
  res.send(`Check API is running.... ${PORT}`);
});
// for initial payment
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { price } = req.body;

    // Ensure that price is a valid number and greater than 0
    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid price" });
    }

    // Convert price to cents (Stripe requires amounts in the smallest currency unit)
    const amount = parseInt(price * 100);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Send back the client secret from the payment intent
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Error creating payment intent: ", err);

    // Respond with an error status and message
    res.status(500).json({
      error: "Payment intent creation failed. Please try again.",
    });
  }
});

// it going catch all the routes that start with /api/auth/xxx** */
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/app", appRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/languagecost", languageCostRoutes);
app.use("/api/notification", notification);

// static files in production remove for vercel
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// // any file without the routes above will be served from the frontend/dist folder
// // redirect backend server to frontend server
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

app.listen(PORT, () => {
  connectToMongoDB();

  console.log(`Server running on port ${PORT}`);
});

export default app;
