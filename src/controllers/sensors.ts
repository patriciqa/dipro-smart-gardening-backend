import {
  flux,
  InfluxDB,
  ParameterizedQuery,
  Point,
} from "@influxdata/influxdb-client";
import { writeNotification, deleteNotification } from "./notifications";
const url = process.env.INFLUX_URL ?? "http://localhost:8086";
const token =
  process.env.INFLUX_TOKEN ??
  "Hl08yLySGOkDIRaEkl3qsNqOEtzKhqSCB-FyK0Fo0V_HFpOJQfUHF5es998t_5kOp0EEsF0jy8Q0TDVIKlg1Jw==";
const org = process.env.INFLUX_ORG ?? "HSLU";
const bucket = process.env.INFLUX_BUCKET ?? "HSLU";

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

interface Arduino {
  table: number;
  _start: string;
  _stop: string;
  _time: string;
  _value: number;
  _field: string;
  _measurement: string;
  sensor_id: string;
}
function getRows<T>(query: ParameterizedQuery) {
  return new Promise<T[]>((resolve, reject) => {
    const rows: T[] = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row) as T;
        rows.push(o);
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(rows);
      },
    });
  });
}

export async function getData(sensorId: string) {
  const fluxQuery = flux`from(bucket: ${bucket})
  |> range(start: 0)
  |> filter(fn: (r) => r.sensor_id == ${sensorId}) 
  |> last()`;

  /** Execute a query and receive line table metadata and rows. */
  const data = await getRows<Arduino>(fluxQuery);
  return data[0]?._value;
}

const influxDB = new InfluxDB({ url, token });

/**
 * Create a write client from the getWriteApi method.
 * Provide your `org` and `bucket`.
 **/

export function writeSensorId(sensorLabel: string, value: number) {
  const writeApi = influxDB.getWriteApi(org, bucket);
  const sensorId = new Point("sensors")
    .tag("sensor_id", sensorLabel)
    .floatField("value", value);
  writeApi.writePoint(sensorId);
  writeApi.close().then(() => {
    console.log("WRITE FINISHED");
  });

  if (value <= 300) {
    writeNotification(sensorLabel);
  } else {
    deleteNotification(sensorLabel);
  }
}
