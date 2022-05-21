const GET_IP = "https://api.ipify.org?format=json";

const IP_COUNTRY_CITY = (IP) => {
  return `https://geo.ipify.org/api/v2/country,city?apiKey=at_M8T0QaTcLNBS3u4PQZwHGam7ZvNJ4&ipAddress=${IP}`;
};

const MAP_ZOOM = 12;

export { IP_COUNTRY_CITY, GET_IP, MAP_ZOOM };
