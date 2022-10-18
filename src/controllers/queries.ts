export const floorsQuery = `PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
select * where { 
  ?floorId a brick:Floor.
  ?floorId rdfs:label ?floorLabel.
  ?floorId rdfs:floorNumber ?floorNumber.
}
`;

export const floorQuery = `PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
PREFIX sstoffi: <https://brickbuilding.hslu.ch/buildings/suurstoffi1b#>
PREFIX plants: <http://digitialideation.hslu.ch/dipro/plants#>
select ?floorLabel ?roomId ?roomLabel (count(distinct ?plant) as ?plantCount) where {
  ?floor a brick:Floor.
    ?floor rdfs:label ?floorLabel.
    ?roomId brick:isPartOf ?floor.
    ?roomId rdfs:label ?roomLabel.
   optional {
    ?plant brick:hasLocation ?roomId.
    ?plant a plants:Plant.
   }
} GROUP BY ?floor ?floorLabel ?roomId ?roomLabel 
`;

export const roomQuery = `PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX btlo: <http://bt.schema.siemens.io/shared/btlo#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
PREFIX plants: <http://digitialideation.hslu.ch/dipro/plants#>

select * where {
    ?room a brick:Room.
    ?room rdfs:label ?roomLabel.
    ?room brick:isPartOf ?floor.
    ?floor rdfs:label ?floorLabel.
    optional {
    ?plantId brick:hasLocation ?room.
    ?plantId a plants:Plant . 
    ?plantId plants:species ?plantSpecies.
    ?airEquipment a brick:Equipment.
    ?airEquipment brick:hasLocation ?room.
 
    ?airTemp a brick:Zone_Air_Temperature_Sensor.
    ?airTemp rdfs:label ?airTempLabel.
    ?airEquipment brick:hasPoint ?airTemp.
        
    ?airHumidity a brick:Zone_Air_Humidity_Sensor.
    ?airHumidity rdfs:label ?airHumidityLabel.
    ?airEquipment brick:hasPoint ?airHumidity.
    
    ?airQualityEquipment a brick:Equipment.
    ?airQualityEquipment brick:hasLocation ?room.
    ?airQuality a brick:CO2_Sensor.
    ?airQuality rdfs:label ?airQualityLabel.
    ?airQualityEquipment brick:hasPoint ?airQuality. 
    }
} 
`;

export const plantQuery = `PREFIX btzf: <http://bt.schema.siemens.io/shared/btzf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX btlo: <http://bt.schema.siemens.io/shared/btlo#>
PREFIX brick: <https://brickschema.org/schema/Brick#>
PREFIX plants: <http://digitialideation.hslu.ch/dipro/plants#>

select * where {
    ?plant a plants:Plant .
    ?plant plants:id ?plantId.
    ?soilMoistureEquipment brick:hasLocation ?room.
    ?soilMoisture a plants:SoilMoistureSensor.
    ?soilMoisture rdfs:label ?moistureLabel.
    ?soilMoistureEquipment brick:hasPoint ?soilMoisture. 
    ?soilMoisture brick:measures ?plant.
    ?plant brick:hasLocation ?room.
    ?room rdfs:label ?roomLabel.
    ?room brick:isPartOf ?floor.
    ?floor rdfs:label ?floorLabel.
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
`;
