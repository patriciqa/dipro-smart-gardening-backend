import mysql from "mysql2";
import { getId, getNotifications } from "./building";

let connection: mysql.Connection | undefined;
async function createConnection() {
  try {
    if (connection) {
      await connection.promise().ping();
      return connection;
    }
  } catch(err) {
    console.error("Connection to mysql lost", err);
  }

  connection = mysql.createConnection({
    host: process.env.MYSQL_HOST ?? "localhost",
    user: "dipro",
    password: "dipro",
    database: "DIPRO",
  });
  connection.on("error", (err: Error) => {
    console.error("Connection to mysql lost", err);
    connection = undefined;
  });
  return connection;
}

export async function writeNotification(sensorLabel: string) {
  const con = await createConnection();
  console.log("Connected!");
  if (await checkIfNotificationExists(sensorLabel)) {
    return;
  }
  var sql =
    "INSERT INTO notifications (sensorid, plant, plantId, type, date, floor, room, roomId, plantImage) VALUES (?,?,?,?,?,?,?,?,?)";
  const notificationInfo = await getNotifications(sensorLabel);

  console.log(notificationInfo);

  if (notificationInfo !== undefined) {
    const date = new Date();
    var values = [
      sensorLabel,
      notificationInfo.plantSpecies,
      notificationInfo.plantId,
      "Water",
      date,
      notificationInfo.floorLabel,
      notificationInfo.roomLabel,
      getId(notificationInfo.room),
      notificationInfo.plantImage,
    ];
    con.query(sql, values, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  }
}

export async function deleteNotification(sensorLabel: string) {
  const con = await createConnection();
  var sql = "DELETE FROM notifications WHERE sensorid = ?";
  con.query(sql, [sensorLabel], function (err, result) {
    if (err) throw err;
    console.log("Deleted form Datebase");
  });
}

function checkIfNotificationExists(sensorLabel: string) {
  return new Promise<boolean>(async (resolve, reject) => {
    const con = await createConnection();
    con.query(
      "SELECT * FROM notifications WHERE sensorid = ?",
      [sensorLabel],
      function (err, result, fields) {
        if (err) reject(err);
        console.log(result);
        if (Array.isArray(result) && result.length >= 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
}

export function readNotifications() {
  return new Promise<any[]>(async (resolve, reject) => {
    const con = await createConnection();
    con.query(
      "SELECT * FROM notifications",
      function (err, result, fields) {
        if (err) reject(err);
        resolve(result as any[]);
      }
    );
  });
}
