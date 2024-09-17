import express from "express";
// import protectRoute from "../middleware/protectRoute.js";
import {
    getAllPaymentCurrentUser
} from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/getAllPayment/:userId", getAllPaymentCurrentUser);



export default router;
