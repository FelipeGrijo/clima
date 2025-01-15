/* eslint-disable import/prefer-default-export, arrow-body-style */

const IPV4_REGEX = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;
const GEODB_API_URL = 'https://www.geolocation-db.com/json';
const HEADERS = {
  // 'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Origin': 'https://clima.felipe.stream',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
};

async function getGeoDBData(ip) {
  try {
    const response = await fetch(`${GEODB_API_URL}/${ip}`);

    if (!response.ok) {
      console.error(`[ERRO] Geolocation-DB API: ${response.status} - ${response.statusText}`);
      return null;
    }

    const locationData = await response.json();

    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      city: locationData.city,
      state: locationData.state,
      country_name: locationData.country_name,
      country_code: locationData.country_code,
      postal: locationData.postal,
    };
  } catch (error) {
    console.error('[ERRO] Erro ao obter localização usando Geolocation-DB:', error);
    return null;
  }
}

async function getLocation({ request, ip, isIpV4 }) {
  const cfData = {
    latitude: request.cf?.latitude ?? null,
    longitude: request.cf?.longitude ?? null,
    city: request.cf?.city ?? null,
    state: request.cf?.region ?? null,
    country_name: null,
    country_code: request.cf?.country ?? null,
    postal: request.cf?.postalCode ?? null,
  };

  if (!isIpV4) {
    return cfData;
  }

  const geodbData = await getGeoDBData(ip);

  if (
    geodbData === null
    || (geodbData.city === 'Not found' && geodbData.state === 'Not found')
    || (geodbData.city === null && geodbData.state === null) //
  ) {
    return cfData;
  }

  return geodbData;
}

export async function onRequest(context) {
  const { request } = context;

  try {
    const ip = request.headers.get('cf-connecting-ip');

    const isIpV4 = IPV4_REGEX.test(ip);
    const location = await getLocation({ request, ip, isIpV4 });

    return new Response(JSON.stringify(location), {
      headers: HEADERS,
    });
  } catch (error) {
    console.error('[ERRO] Erro ao processar a requisição:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
      }),
      {
        headers: HEADERS,
        status: 500,
      },
    );
  }
}
