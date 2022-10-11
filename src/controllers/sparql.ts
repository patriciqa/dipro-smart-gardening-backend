/// <reference path="../../node_modules/graphdb/lib/types.d.ts" />
// @ts-ignore
const { RDFMimeType } = require("graphdb").http;
// @ts-ignore
const { RepositoryClientConfig, RDFRepositoryClient } =
  require("graphdb").repository;
// @ts-ignore
const { GetQueryPayload } = require("graphdb").query;
import { plantQuery, floorQuery, floorsQuery } from "./queries";

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

const query = ` PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
select * where { 
  ?floor a brick:Floor.
    ?floor rdfs:label ?floorLabel.
} 
`;

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
  return entries;
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
    const floor = { floorLabel, rooms: entries };
    return floor;
  }
  return null;
}

export async function getRoom(roomId: string) {
  const payload = (
    new GetQueryPayload().setQuery(plantQuery) as unknown as GetQueryPayload
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
    entries.forEach((e) => {
      delete e.room;
      delete e.roomLabel;
    });
    if ("plant" in entries[0]) {
      plants = entries;
    }
    const room = { roomLabel, plants };
    return room;
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
