/// <reference path="../../node_modules/graphdb/lib/types.d.ts" />
// @ts-ignore
const { RDFMimeType } = require("graphdb").http;
// @ts-ignore
const { RepositoryClientConfig, RDFRepositoryClient } =
  require("graphdb").repository;
// @ts-ignore
const { GetQueryPayload } = require("graphdb").query;
import { Request, Response } from "express";

const config = new RepositoryClientConfig("http://localhost:7200/")
  .setEndpoints(["http://localhost:7200/repositories/Surstoffi"])
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

// getting all floors
const getFloors = async (req: Request, res: Response) => {
  const payload = (
    new GetQueryPayload().setQuery(query) as unknown as GetQueryPayload
  )
    .setQueryType(QueryType.SELECT)
    .addBinding("$floorFilter", '"Flr00"')
    .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON)
    .setLimit(20);

  (async () => {
    const q: Promise<NodeJS.ReadStream> = repository.query(payload);
    try {
      const stream = await q;
      const result = await readString(stream);
      const entries = simplifyJson(result);
      res.status(200).json(entries);
      res.end();
      console.log(entries);
    } catch (err) {
      console.error("Could not load data from graphDB", err);
      res.status(500).write("");
      res.end();
    }
  })();
};

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

export default { getFloors };
