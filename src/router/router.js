import express from "express";
import { addCustomer } from "../controller/user.js";
const router = express.Router();


router.post('/identify', addCustomer)








export default router