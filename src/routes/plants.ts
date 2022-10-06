import express from "express";
import controller from "../controllers/sparql";

const router = express.Router();

// router.get("plants", controller.getFloors());

router.get("/plants", controller.getFloors);

export default router;