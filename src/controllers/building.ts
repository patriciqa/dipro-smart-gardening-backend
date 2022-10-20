/// <reference path="../../node_modules/graphdb/lib/types.d.ts" />
// @ts-ignore
const { RDFMimeType } = require("graphdb").http;
// @ts-ignore
const { RepositoryClientConfig, RDFRepositoryClient } =
  require("graphdb").repository;
// @ts-ignore
const { GetQueryPayload } = require("graphdb").query;
import {
  roomQuery,
  floorQuery,
  floorsQuery,
  plantQuery,
  notificationQuery,
} from "./queries";
import { getData } from "./sensors";

const graphUrl = process.env.GRAPH_URL ?? "http://localhost:7200";
const repositoryName = process.env.GRAPH_REPO ?? "Surstoffi";

const repoUrl = `${graphUrl}/repositories/${repositoryName}`;

const config = new RepositoryClientConfig(graphUrl)
  .setEndpoints([repoUrl])
  .setHeaders({
    Accept: RDFMimeType.SPARQL_RESULTS_JSON,
  })
  .setReadTimeout(30000)
  .setWriteTimeout(30000);
const repository = new RDFRepositoryClient(config);

export async function getFloors() {
  const payload = (
    new GetQueryPayload().setQuery(floorsQuery) as unknown as GetQueryPayload
  )
    .setQueryType(QueryType.SELECT)
    .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON);

  const q: Promise<NodeJS.ReadStream> = repository.query(payload);
  const stream = await q;
  const result = await readString(stream);
  const entries = simplifyJson(result);
  return entries.map((e) => {
    return { ...e, floorId: getId(e.floorId) };
  });
}

export async function getFloor(floorId: string) {
  const payload = (
    new GetQueryPayload().setQuery(floorQuery) as unknown as GetQueryPayload
  )
    .setQueryType(QueryType.SELECT)
    .addBinding(
      "$floor",
      `<https://brickbuilding.hslu.ch/buildings/suurstoffi1b#${floorId}>`
    )
    .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON);

  const q: Promise<NodeJS.ReadStream> = repository.query(payload);
  const stream = await q;
  const result = await readString(stream);
  const entries = simplifyJson(result);
  if (entries.length > 0) {
    const floorLabel = entries[0].floorLabel;
    entries.forEach((e) => delete e.floorLabel);
    entries.forEach((e) => {
      e.roomId = getId(e.roomId);
    });
    const floor = { floorLabel, rooms: entries };
    return floor;
  }
  return null;
}

export async function getRoom(roomId: string) {
  const payload = (
    new GetQueryPayload().setQuery(roomQuery) as unknown as GetQueryPayload
  )
    .setQueryType(QueryType.SELECT)
    .addBinding(
      "$room",
      `<https://brickbuilding.hslu.ch/buildings/suurstoffi1b#${roomId}>`
    )
    .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON);

  const q: Promise<NodeJS.ReadStream> = repository.query(payload);
  const stream = await q;
  const result = await readString(stream);
  const entries = simplifyJson(result);
  if (entries.length > 0) {
    let plants = [];
    const roomLabel = entries[0].roomLabel;
    const floorLabel = entries[0].floorLabel;
    const airTempLabel = entries[0].airTempLabel;
    const airHumidityLabel = entries[0].airHumidityLabel;
    const airQualityLabel = entries[0].airQualityLabel;
    entries.forEach((e) => {
      delete e.room;
      delete e.roomLabel;
      delete e.floor;
      delete e.floorLabel;
      delete e.airEquipment;
      delete e.airTemp;
      delete e.airTempLabel;
      delete e.airHumidity;
      delete e.airHumidityLabel;
      delete e.airQualityEquipment;
      delete e.airQuality;
      delete e.airQualityLabel;
    });

    if ("plantId" in entries[0]) {
      plants = entries;
    }
    plants.forEach((e) => {
      e.plantId = getId(e.plantId);
    });

    const airHumidity = await getData(airHumidityLabel);
    const airQuality = await getData(airQualityLabel);
    const airTemp = await getData(airTempLabel);

    const room = {
      roomLabel,
      floorLabel,
      airTemp,
      airHumidity,
      airQuality,
      plants,
    };
    return room;
  }
}

export async function getPlant(plantId: string) {
  const payload = (
    new GetQueryPayload().setQuery(plantQuery) as unknown as GetQueryPayload
  )
    .setQueryType(QueryType.SELECT)
    .addBinding(
      "$plant",
      `<https://brickbuilding.hslu.ch/buildings/suurstoffi1b#${plantId}>`
    )
    .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON);

  const q: Promise<NodeJS.ReadStream> = repository.query(payload);
  const stream = await q;
  const result = await readString(stream);
  const entries = simplifyJson(result);
  const e = entries[0];
  if (e !== undefined) {
    delete e.floor;
    delete e.room;
    delete e.plant;
    delete e.soilMoistureEquipment;
    e.soilMoisture = await getData(e.moistureLabel);
    delete e.moistureLabel;
  }
  return e;
}
export async function getNotifications(sensorLabel: string) {
  const payload = (
    new GetQueryPayload().setQuery(
      notificationQuery
    ) as unknown as GetQueryPayload
  )
    .setQueryType(QueryType.SELECT)
    .addBinding("$sensorLabel", `"${sensorLabel}"`)
    .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON);

  const q: Promise<NodeJS.ReadStream> = repository.query(payload);
  const stream = await q;
  const result = await readString(stream);
  const entries = simplifyJson(result);
  return entries[0];
}

function getId(url: string) {
  const regex = new RegExp("[^#]+$");
  const match = regex.exec(url);
  if (match !== null) {
    return match[0];
  }
  return null;
}

function readString(stream: NodeJS.ReadStream) {
  const chunks: Buffer[] = [];
  return new Promise<string>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function simplifyJson(json: string) {
  const data = JSON.parse(json);
  const entries = data?.results?.bindings;
  if (Array.isArray(entries)) {
    return entries.map((e) => {
      const entry: any = {};
      for (const key of Reflect.ownKeys(e)) {
        entry[key] = e[key]?.value;
      }
      return entry;
    });
  }
  return [];
}
