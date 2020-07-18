const geonamesURL = 'http://api.geonames.org/searchJSON?q=';

export const geonamesAPI = async (city, country = '') => {

  const url = geonamesURL + city + '&country=' + country + '&maxRows=2&username=h.v.raj3';
  const res = await fetch('https://cors-anywhere.herokuapp.com/' + url);
  try {
    const data = await res.json();

    if (data.totalResultsCount == 0) {
      return { error: "The " + city + " can't be found" };
    }
    return data;

  } catch (err) {
    console.log(err);
  }

}

export const getWeatherAPI = async (lat, lng) => {

  const API_WEATHERBIT_KEY = '09cc54108d1b44c3b506d124038ef679';
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${API_WEATHERBIT_KEY}`;
  const res = await fetch('https://cors-anywhere.herokuapp.com/' + url);
  try {
    const data = await res.json();
    console.log(data);
    return data;

  } catch (err) {
    console.log(err);
  }

}

export const getImageAPI = async (keyword) => {

  //replace the spaces with + sign;
  keyword = keyword.replace(/\s/g, '+');

  const PIXABAY_API_KEY = '17532701-fe06d107daa4dfb6cf38ef0e7';
  const callUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${keyword}&image_type=photo&pretty=true`;
  const res = await fetch('https://cors-anywhere.herokuapp.com/' + callUrl);

  try {

    const data = await res.json();
    return data;

  } catch (err) {
    console.log(err);
  }

}