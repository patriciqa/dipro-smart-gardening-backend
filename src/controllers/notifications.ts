import mysql from "mysql2";
import { getId, getNotifications } from "./building";

let connection: mysql.Connection;
function createConnection() {
  if (connection) {
    return connection;
  } else {
    connection = mysql.createConnection({
      host: process.env.MYSQL_HOST ?? "localhost",
      user: "dipro",
      password: "dipro",
      database: "DIPRO",
    });
    return connection;
  }
}

export function writeNotification(sensorLabel: string) {
  createConnection().connect(async function (err) {
    if (err) throw err;
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
      createConnection().query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    }
  });
}

export function deleteNotification(sensorLabel: string) {
  createConnection().connect(function (err) {
    if (err) throw err;
    var sql = "DELETE FROM notifications WHERE sensorid = ?";
    createConnection().query(sql, [sensorLabel], function (err, result) {
      if (err) throw err;
      console.log("Deleted form Datebase");
    });
  });
}

function checkIfNotificationExists(sensorLabel: string) {
  return new Promise<boolean>((resolve, reject) => {
    createConnection().connect(function (err) {
      if (err) throw err;
      createConnection().query(
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
  });
}

export function readNotifications() {
  return new Promise<any[]>((resolve, reject) => {
    createConnection().connect(function (err) {
      if (err) reject(err);
      createConnection().query(
        "SELECT * FROM notifications",
        function (err, result, fields) {
          if (err) reject(err);
          resolve(result as any[]);
        }
      );
    });
  });
}
