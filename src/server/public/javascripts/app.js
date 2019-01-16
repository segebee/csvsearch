// declare constants
const getPersonsUrl = "/persons";
const searchPersonsUrl = "/persons/search";
const createPersonsUrl = "/persons/create";
const searchField = "#searchField";
const searchResults = "#searchResults";
const searchItem = ".search-result-item";
const resultsList = "#resultsList";
const resultDetails = "#resultDetails";
const uploadForm = "#uploadForm";

// is document ready
$(document).ready(function() {
  // define constants

  // handle search on keyup
  $(searchField).on("keyup paste", function() {
    // clear results list
    // $(resultsList).html("");
    const keyword = $(this).val();
    if (keyword.length < 1) {
      $(resultsList).slideUp();
      // .empty();
      return false;
    }
    console.log({ keyword });
    // search db with keyword
    searchPersons(searchPersonsUrl, keyword);
  });

  // handle search result selection
  $(searchItem).on("click", function() {
    // hide autocomplete
    $(resultsList).slideUp("slow");
    // get data
    const data = $(this).data();
    console.log({ data });
    // render data
    const renderedHtml = renderResultDetails(data);
    console.log({ renderedHtml });
    // display data
    $(resultDetails).html(renderedHtml);
  });

  // handle uploads
  $(uploadForm).on("submit", function(event) {
    event.preventDefault();
    // shift focus to the search box
    $(searchField).focus();
  });
});

// fetch the list of persons
// function fetchAllPersons(getPersonsUrl) {
//   let persons = [];
//   $.getJSON(getPersonsUrl, function(resp) {
//     console.log({ resp });
//     persons = resp.data;
//   });
// }

// upload csv
function createPersons(createPersonsUrl) {
  let persons = [];
  $.getJSON(createPersonsUrl, function(resp) {
    console.log({ resp });
    persons = resp.data;
  });
}

// fetch the list of persons
function searchPersons(searchPersonsUrl, keyword) {
  let persons = [];
  const searchRequest = `${searchPersonsUrl}?keyword=${keyword}`;
  $.getJSON(searchRequest, function(resp) {
    console.log({ resp });
    if (resp.error) {
      // handle error
      console.log("error occured", resp.message);
      $(resultsList)
        .html(resp.message)
        .slideDown("slow");
      return false;
    }

    persons = resp.data;
    handleSearchResults(persons);
  });
}

// upload csv
function handleSearchResults(result) {
  console.log({ result });
  console.log("search len", result.length);
  // render auto complete
  const autoComplete = renderAutoComplete(result);
}

// upload csv
function renderAutoComplete(result) {
  if (result.length < 1) {
    // handle no result found
    const message = "<li>No Records found</li>";
    $(resultsList)
      .html(message)
      .slideDown("slow");
  }
  // render results
  let list = "";
  result.forEach(result => {
    list += `<li class="search-result-item" data-name="${
      result.name
    }" data-age="${result.age}" data-address="${result.address}" data-team="${
      result.team
    }">${result.name}</li>`;
  });
  $(resultsList)
    .html(list)
    .slideDown("slow");
  console.log({ list });
}

function renderResultDetails(data) {
  return `<table class='table table-striped'><tbody><tr><td>Name</td><td>${
    data.name
  }</td></tr><tr><td>Age</td><td>${data.age}</td></tr><tr><td>Address</td><td>${
    data.address
  }</td></tr><tr><td>Team</td><td>${data.team}</td></tr></tbody></table>`;
}
