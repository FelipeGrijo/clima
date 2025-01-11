/* eslint-disable import/prefer-default-export, arrow-body-style */

const getGeoDBData = async () => {
  try {
    const geodbResponse = await fetch('https://www.geolocation-db.com/json/');

    if (!geodbResponse.ok) {
      console.error(`HTTP error! status: ${geodbResponse.status}`);
      return null;
    }

    const locationData = await geodbResponse.json();

    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      city: locationData.city,
      state: locationData.state,
      country_name: locationData.country_name,
      country_code: locationData.country_code,
      postal: locationData.postal,
      // IPv4: locationData.IPv4,
    };
  } catch (error) {
    console.error('Erro ao obter localização usando Geolocation-DB:', error);
    return null;
  }
};

export async function onRequest(context) {
  const { request } = context;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Origin': 'https://clima.felipe.stream',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };

  const geodbData = await getGeoDBData();

  const cfData = {
    latitude: request.cf.latitude,
    longitude: request.cf.longitude,
    city: request.cf.city,
    state: request.cf.region,
    region_code: request.cf.regionCode,
    country_name: null,
    country_code: request.cf.country,
    continent: request.cf.continent,
    // asn: request.cf.asn,
    timezone: request.cf.timezone,
    postal: request.cf.postalCode,
    // as_organization: request.cf.asOrganization,
  };

  return new Response(
    JSON.stringify({
      geodb: geodbData,
      cf: cfData,
    }),
    {
      headers,
    },
  );
}
