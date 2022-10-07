import express, { Request, Response } from "express";
import { getRoom, getFloors, getFloor } from "../controllers/sparql";
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

router.get("/floors/:floorId", async (req: Request, res: Response) => {
  try {
    const entries = await getFloor(req.params.floorId);
    res.status(200).json(entries);
    console.log(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});

router.get("/rooms/:roomId", async (req: Request, res: Response) => {
  try {
    const entries = await getRoom(req.params.roomId);
    res.status(200).json(entries);
    console.log(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});

export default router;
