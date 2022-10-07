import express, { Request, Response } from "express";
import { getPlants, getFloors } from "../controllers/sparql";
const router = express.Router();

router.get("/floors", async (req: Request, res: Response) => {
  try {
    const entries = await getFloors();
    res.status(200).json(entries);
    console.log(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});

router.get("/plants", async (req: Request, res: Response) => {
  try {
    const entries = await getPlants();
    res.status(200).json(entries);
    console.log(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});


export default router;
