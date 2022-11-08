# Plants in Smart Buildings

Backend for an integration of plants in smart buildings.

- [View Demo Site of Frontend where Backend is loaded](https://dipro-smart-building.netlify.app/) (preferably on mobile)

## Project Summary

For the module "Digital Project" we created an integration of plants in smart buildings. We worked in an interdisciplinary team of six people. With three people dedicated to design and three people in the development team.

The products of our project were a High-Fidelity Prototype in Figma and a full-stack Web-App. We built our own semantic model of a building using [Brick Schema](https://brickschema.org/) and stored it using [GraphDB](https://graphdb.ontotext.com/). For live sensor data we built a small arduino prototype with different sensors and stored the sensor data with [InfluxDB](https://www.influxdata.com/). The notifications that show up on the frontend are stored in a [MySQL](https://www.mysql.com/) Database. Finally to acces all the data and send it to the frontend we created a NodeJS backend.

The backend is hosted on our university-own [EnterpriseLab](https://eportal.enterpriselab.ch/) and the frontend was deployed on [Netlify](https://www.netlify.com/).

## Quick Links

- [Frontend Repository](https://github.com/gina6/dipro-smart-buildings-frontend)
- [Arduino Repository](https://github.com/domi-b/dipro-smart-buildings-arduino)
- [Figma Prototype](https://www.figma.com/proto/ohBlXQhGunPGbnQFVygLhO/DIPRO---Design-Konzept?node-id=738%3A8435&scaling=scale-down&page-id=609%3A2480&starting-point-node-id=738%3A8435&show-proto-sidebar=1)

## Technology Stack

### Backend

- [Node.js Webserver with TypeScript](https://nodejs.dev/en/learn/nodejs-with-typescript/)

## Run Locally

To run it locally you need to install [GraphdB](https://graphdb.ontotext.com/), [InfluxDB](https://www.influxdata.com/InfluxDb) and [MySQL](https://www.mysql.com/).

- GraphDB is used for the building model.
- InfluxDb is used to save the Arduino sensor data of the plants.
- MySQL is used to save the notificatios, for when the plants need water.

### Clone Repo

```
git clone https://github.com/patriciqa/dipro-smart-gardening-backend
```

### Install dependencies

```
npm install
```

### Run App

```
npm run dev
```
