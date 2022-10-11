export const floorsQuery = ` PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
select * where { 
  ?floorId a brick:Floor.
  ?floorId rdfs:label ?floorLabel.
} 
`;

export const floorQuery = `PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
PREFIX sstoffi: <https://brickbuilding.hslu.ch/buildings/suurstoffi1b#>
PREFIX plants: <http://digitialideation.hslu.ch/dipro/plants#>
select ?floorLabel ?room ?roomLabel (count(distinct ?plant) as ?count) where {
  ?floor a brick:Floor.
    ?floor rdfs:label ?floorLabel.
    ?room brick:isPartOf ?floor.
    ?room rdfs:label ?roomLabel.
   optional {
    ?plant brick:hasLocation ?room.
    ?plant a plants:Plant.
   }
} GROUP BY ?floor ?floorLabel ?room ?roomLabel 
`;

export const plantQuery = `PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX btlo: <http://bt.schema.siemens.io/shared/btlo#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
PREFIX plants: <http://digitialideation.hslu.ch/dipro/plants#>

select * where {
     ?room a brick:Room.
    ?room rdfs:label ?roomLabel.
    optional {
    ?plant brick:hasLocation ?room.
    ?plant a plants:Plant .
    ?plant plants:species ?plantSpecies.
    ?plant plants:potSize ?potSize.
    ?plant plants:lightNeed ?lightNeed.
    ?plant plants:substrate ?substrate.
    ?plant plants:waterNeed ?waterNeed.
    ?plant plants:plantDate ?plantDate.
    ?plant plants:plantImage ?plantImage.
    ?plant plants:lastService ?lastService.
    ?plant plants:nextService ?nextService. 
    }
} 
`;
