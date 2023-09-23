'use strict';

const { randomUUID } = require('crypto');
const { dynamodb } = require("../../utils/dynamodb");
const { fetchdata } = require('../../service/fetch/fetchdata');
const { responseObject } = require('../../utils/response');

module.exports.save = async (event, context) => {
  try {
    const timestamp = new Date().getTime();
    const planetData = JSON.parse(event.body);

    if (typeof planetData.idplaneta !== 'number') {
      console.error('Validation Failed');
      return responseObject(400, { message: 'Could not create planet item. idplanet is required' });
    }

    const idplanet = planetData.idplaneta;
    const swapiUrl = `https://swapi.py4e.com/api/planets/${idplanet}`;
    const response = await fetchdata(swapiUrl);

    if (!response) {
      return responseObject(500, { message: 'Failed to fetch data from SWAPI.' });
    }

    const spanishData = {
      'diametro': response.diameter,
      'clima': response.climate,
      'superficie_agua': response.surface_water,
      'nombre': response.name,
      'creado': response.created,
      'url': response.url,
      'periodo_rotacion': response.rotation_period,
      'terreno': response.terrain,
      'gravedad': response.gravity,
      'periodo_orbital': response.orbital_period,
      'peliculas': response.films,
      'residentes': response.residents,
      'poblacion_promedio': response.population
    };

    const params = {
      TableName: process.env.PLANET_TABLE,
      Item: {
        idplaneta: randomUUID(),
        id: planetData.idplaneta,
        creado: timestamp,
        editado: timestamp,
        ...spanishData
      },
    };

    await dynamodb.put(params).promise();
    return responseObject(200, params.Item);
  } catch (error) {
    console.error('Error saving planet data:', error);
    return responseObject(error.statusCode || 500, { message: 'Failed to save data on DB' });
  }
};
