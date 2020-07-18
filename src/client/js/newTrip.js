import { geonamesAPI, getWeatherAPI, getImageAPI } from './api';
import { scrollToSection } from './helpers';
import { displayAllTrips } from './trips';

export const getDataFromAPIs = async (data) => {
  let trip = {}

  trip.dateStart = data.dateStart;
  trip.dateEnd = data.dateEnd;
  trip.toDoList = [];
  trip.error = '';

  await geonamesAPI(data.location)
    .then(resLocation => {
      if (resLocation.error) {

        trip.error = resLocation.error;
      }
      else {

        trip.location = {
          city: resLocation.geonames[0].toponymName,
          lat: resLocation.geonames[0].lat,
          lng: resLocation.geonames[0].lng
        };

      }
    });

  // get Destination Coordinates
  await geonamesAPI(data.destination)
    .then(resDestination => {

      if (resDestination.error) {
        trip.error = resDestination.error;
      }
      else {

        // add the Destination info to the object
        trip.destination = {
          city: resDestination.geonames[0].toponymName,
          country: resDestination.geonames[0].countryName,
          lat: resDestination.geonames[0].lat,
          lng: resDestination.geonames[0].lng
        };
      }
    })

  if (trip.error === '') {

    //get the Weather by Destination Coords and DateStart
    await getWeatherAPI(trip.destination.lat, trip.destination.lng)
      .then(resWeather => {
        const onDate = resWeather.data.find(res => res.datetime === data.dateStart);
        if (onDate) {
          trip.weather = {
            temperatureMax: onDate.max_temp,
            temperatureMin: onDate.min_temp,
            summary: onDate.weather.description,
            icon: onDate.weather.icon
          }
        }


      })


    //get the Image by Destination City
    await getImageAPI(trip.destination.city)
      .then(cityImg => {

        //Image found by Destination City Name
        if (cityImg.totalHits > 0) {
          trip.image = cityImg.hits[0].largeImageURL;
        }
        else {
          //Image not found
          //Send another API request to get the Image by Destination Country Name
          getImageAPI(trip.destination.country)
            .then(countryImg => {

              //image found
              if (countryImg.totalHits > 0) {
                trip.image = countryImg.hits[0].largeImageURL
              }
              else {
                // the Image Placeholder will be added instead
                trip.image = false;
              }
            })
        }

      })


  }

  return trip;

}

export const addMoreDestinations = (trips) => {

  //clone the trips array/pbject
  const newData = trips.slice();

  //get the DOM
  const location = document.getElementById('location');
  const destination = document.getElementById('destination');
  const dateStart = document.getElementById('date-start');
  const dateEnd = document.getElementById('date-end');

  //reverse the array
  const lastDestination = newData.reverse()[0];

  //get the Last destination from the trips
  const lastDateEnd = lastDestination.dateEnd;
  const lastDestinationCity = lastDestination.destination.city;

  //clear and assign new values
  location.value = lastDestinationCity;
  destination.value = '';
  dateStart.value = lastDateEnd;
  dateEnd.value = '';

  //disable the inputs
  location.disabled = true;
  dateStart.disabled = true;

  //remove the valid classes
  destination.classList.remove('valid');
  dateEnd.classList.remove('valid');

  //enable search button
  document.getElementById('search').classList.remove('disabled');

  //scroll to form
  scrollToSection('trip-form');

}

export const saveNewTrip = (trips) => {

  //check if the LocalStorage is supported by User's Browser
  if (window.localStorage !== undefined) {

    let newTPcapstone = [];

    if (localStorage.getItem('tp_capstone')) {
      newTPcapstone = [...JSON.parse(localStorage.getItem('tp_capstone')), trips]
    } else {
      newTPcapstone = [trips];
    }

    //add the trip to LocalStorage
    localStorage.setItem('tp_capstone', JSON.stringify(newTPcapstone));

    //update Landing UI
    updateForm();

    return true;


  } else {

    alert('Your Browser doesn\'t support the local storage. \nPlease, update your browser!');

    return false;
  }

}

export const updateForm = () => {

  //get the DOM
  const tripFormBlock = document.getElementById('trip-form');
  const formInputs = tripFormBlock.querySelectorAll('input');
  const searchBtn = document.getElementById('search');

  formInputs.forEach((el) => {
    el.value = '';
    el.disabled = false;
    el.classList.remove('valid');
  });

  searchBtn.classList.remove('disabled');

  //hide the trip create seaction
  document.getElementById('trip-create').classList.remove('active');

  displayAllTrips();

  scrollToSection('trip-list');
}