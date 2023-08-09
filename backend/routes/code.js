import express from "express";
import Code from "../models/Code.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const expiration = new Date(req.body.expiration);
    const codeData = new Code({
      userId: req.body.userId,
      code: req.body.code,
      expiration: expiration,
    });
    codeData.save();
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
});

// router.post("/use", async (req, res) => {
//   try {
//     const { code, userId } = req.body;
//     const codeDB = await Code.findOne({
//       code: code,
//       userId: userId,
//     });
//     if (!codeDB) {
//       return res.status(400).json({ message: "invalid code" });
//     }
//     if (codeDB.expiration < new Date()) {
//       return res.status(400).json({ message: "expired code" });
//     }
//     await Code.findOneAndUpdate(
//       { code: code, userId: userId },
//       { used: codeDB.used + 1 }
//     );
//     return res.status(200).json({ message: "success" });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.post("/validateCode", async (req, res) => {
  try {
    const { code } = req.body;
    const codeDB = await Code.findOne({ code: code });
    console.log(codeDB);
    if (!codeDB) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/updateExpiration", async (req, res) => {
  try {
    const { code, expiration } = req.body;
    const _expiration = new Date(expiration);
    const codeDB = await Code.findOne({ code: code });
    if (!codeDB) {
      return res.status(200).json({ success: false });
    } else {
      await Code.findOneAndUpdate({ code: code }, { expiration: _expiration });
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { code, userId } = req.body;
    await Code.findOneAndDelete({ code: code, userId: userId });
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/getCodes", async (req, res) => {
  try {
    const { userId } = req.body;
    const codes = await Code.find({ userId: userId }).populate("userId");
    return res.status(200).json({ data: codes });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getCodes", async (req, res) => {
  try {
    const codes = await Code.find().populate("userId");
    return res.status(200).json({ data: codes });
  } catch (err) {
    console.log(err);
  }
});

export default router;
