import { formValidation } from './form';
import { createTrip } from './updateUI';
import { scrollToSection, showToDoList, toggleTripCreate, showErrorMessage } from './helpers';
import { getDataFromAPIs, addMoreDestinations, saveNewTrip, updateForm } from './newTrip';

let trips = [];

const createNewTrip = (data) => {

  const newTrip = document.getElementById('new-trip');
  newTrip.innerHTML = '';

  newTrip.appendChild(createTrip(data));
}


document.addEventListener('DOMContentLoaded', () => {

  const searchBtn = document.getElementById('search');
  const newTrip = document.getElementById('new-trip');
  const popupCloseBtn = document.querySelectorAll('.js-popup-close');
  const saveToDoBtn = document.querySelector('.save-to-do');
  const navLink = document.querySelector('nav a');
  searchBtn.addEventListener('click', () => {
    if (!searchBtn.classList.contains('disabled')) {
      let userData = formValidation()
      if (userData) {

        toggleTripCreate('loading');
        scrollToSection('trip-create');

        getDataFromAPIs(userData)
          .then(newTripDestination => {
            if (newTripDestination.error) {
              toggleTripCreate();
              scrollToSection('trip-form');

              showErrorMessage(newTripDestination.error);

              document.getElementById('search').classList.remove('disabled');

            } else {
              trips.push(newTripDestination);

              createNewTrip(trips);
              toggleTripCreate('active');
            }
          });
      }
    }



  });


  newTrip.addEventListener('click', (event) => {

    if (event.target.getAttribute('id') == 'add-more-destination') {
      addMoreDestinations(trips);
    }

    if (event.target.getAttribute('id') == 'save-new-trip') {
      if (saveNewTrip(trips)) trips = [];
    }

    if (event.target.classList.contains('add-to-do')) {

      const tripDestNr = event.target.closest('.new-dest-actions').getAttribute('data-dest-nr');
      showToDoList(tripDestNr);
    }

  }, true)

  popupCloseBtn.forEach(element => {
    element.addEventListener('click', function (event) {
      element.closest('.full-screen').classList.remove('active');

    }, true);
  });

  navLink.addEventListener('click', (event) => {

    event.preventDefault();
    scrollToSection(event.target.dataset.nav);
  });

  saveToDoBtn.addEventListener('click', function (event) {
    trips = saveToDoList(trips);
    createNewTrip(trips);
  }, true);

});


const saveToDoList = (data) => {

  const toDoListText = document.querySelector('input[name="to-do-list"]').value;
  const tripDestNr = document.querySelector('input[name="trip-dest-nr"]').value;

  if (toDoListText.length > 3) {

    data[tripDestNr].toDoList.push(toDoListText);
    document.getElementById('to-do-list').classList.remove('active');

  }

  return data;
}