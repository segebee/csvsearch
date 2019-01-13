// declare constants
const getPersonsUrl = "/persons";
const searchPersonsUrl = "/persons";
const createPersonsUrl = "/persons/create";
// is document ready
$(document).ready(function() {
  fetchAllPersons(getPersonsUrl);
});

// fetch the list of persons
function fetchAllPersons(getPersonsUrl) {
  let persons = [];
  $.getJSON(getPersonsUrl, function(resp) {
    console.log({ resp });
    persons = resp.data;
  });
}

// fetch the list of persons
function searchPersons(searchPersonsUrl) {
  let persons = [];
  $.getJSON(searchPersonsUrl, function(resp) {
    console.log({ resp });
    persons = resp.data;
  });
}

// upload csv
function createPersons(createPersonsUrl) {
  let persons = [];
  $.getJSON(createPersonsUrl, function(resp) {
    console.log({ resp });
    persons = resp.data;
  });
}
