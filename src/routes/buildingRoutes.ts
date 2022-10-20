import express, { Request, Response } from "express";
import {
  getRoom,
  getFloors,
  getFloor,
  getPlant,
} from "../controllers/building";
import { writeSensorId } from "../controllers/sensors";
import path from "path";
import { readNotifications } from "../controllers/notifications";
const router = express.Router();

router.use(express.json());

router.get("/floors", async (req: Request, res: Response) => {
  try {
    const entries = await getFloors();
    res.status(200).json(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});

router.get("/floors/:floorId", async (req: Request, res: Response) => {
  try {
    const entries = await getFloor(req.params.floorId);
    res.status(200).json(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});

router.get("/rooms/:roomId", async (req: Request, res: Response) => {
  try {
    const entries = await getRoom(req.params.roomId);
    res.status(200).json(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});

router.get("/plants/:plantId", async (req: Request, res: Response) => {
  try {
    const entries = await getPlant(req.params.plantId);
    res.status(200).json(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});

router.post("/sensors", async (req: Request, res: Response) => {
  try {
    writeSensorId(req.body.sensor_id, parseFloat(req.body.value));
    res.status(200).send();
  } catch (err) {
    console.error("Could not write into influxDB", err);

    res.status(500).send();
  }
});

router.get("/notifications", async (req: Request, res: Response) => {
  try {
    const entries = await readNotifications();
    res.status(200).json(entries);
  } catch (err) {
    console.error("Could not load data from graphDB", err);
    res.status(500).send();
  }
});


const plantImages = path.join(__dirname, "..", "images");
router.use("/plantImages", express.static(plantImages));

export default router;
