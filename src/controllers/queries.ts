export const floorsQuery = ` PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
select * where { 
  ?floor a brick:Floor.
    ?floor rdfs:label ?floorLabel.
} 
`;

export const floorQuery = ` PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
PREFIX plants: <http://digitialideation.hslu.ch/dipro/plants#>
select * where { 
    ?plant a plants:Plant.
   ?floor a brick:Floor.
   ?plant brick:hasLocation ?room.
   ?room brick:isPartOf ?floor. 
} 
`;

export const plantQuery = ` PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
PREFIX plants: <http://digitialideation.hslu.ch/dipro/plants#>
select * where { 
    ?plant a plants:Plant.
   ?floor a brick:Floor.
   ?plant brick:hasLocation ?room.
   ?room brick:isPartOf ?floor. 
} 
`;
