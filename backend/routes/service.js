import express from "express";
import Service from "../models/Service.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const serviceData = new Service({
      name: req.body.name,
      userid: req.body.userid,
    });
    serviceData.save();
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const serviceData = await Service.find();
    return res.status(200).json({
      serviceData,
    });
  } catch (err) {
    console.log(err);
  }
});
export default router;
