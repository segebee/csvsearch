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
const uploadField = "uploadField";
const uploadMessage = "#uploadMessage";
const progressContainer = ".progress";
const progressBar = document.getElementById("progressbar");

// display upload progress
function showProgress(evt) {
  // update progressBar width
  return (progressBar.style.width = (evt.loaded / evt.total) * 100 + "%");
}
// fetch the list of persons using keyword
function searchPersons(keyword) {
  const searchRequest = `${searchPersonsUrl}?keyword=${keyword}`;
  $.getJSON(searchRequest, function(resp) {
    if (resp.error) {
      // handle error
      const errorMessage = `<li style="color:red">${resp.message}</li>`;
      $(resultsList)
        .html(errorMessage)
        .slideDown("slow");
      return false;
    }
    // pass data returned to function rendering autocomplete
    return renderAutoComplete(resp.data);
  });
}
// display autocomplete
function renderAutoComplete(result) {
  if (result.length < 1) {
    // handle no result found
    const message = `<li>No Records found</li>`;
    return $(resultsList)
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

  // set click event listener for each item
  const item = document.getElementsByClassName("search-result-item");
  return Array.from(item).forEach(element => {
    return element.addEventListener("click", handleSearchResultSelection);
  });
}
// handle when search result is clicked
function handleSearchResultSelection() {
  // hide autocomplete
  $(resultsList).slideUp("slow");
  // get data
  const data = this.dataset;
  // render data
  const renderedHtml = renderResultDetails(data);
  // display data
  return $(resultDetails)
    .html(renderedHtml)
    .show("slow");
}
// display result details
function renderResultDetails(data) {
  return `<table class='table table-striped'><tbody><tr><td>Name</td><td>${
    data.name
  }</td></tr><tr><td>Age</td><td>${data.age}</td></tr><tr><td>Address</td><td>${
    data.address
  }</td></tr><tr><td>Team</td><td>${data.team}</td></tr></tbody></table>`;
}

function hideUploadMessages() {
  // hide progress bar container
  setTimeout(function() {
    $(progressContainer).hide();
    progressBar.style.width = 0;
  }, 1000);
  // hide upload message
  setTimeout(function() {
    $(uploadMessage).slideUp();
  }, 3000);
}

// run when document is loaded
$(document).ready(function() {
  // handle search
  $(searchField).on("keyup paste", function() {
    // hide search item details element
    $(resultDetails).slideUp();
    const keyword = $(this).val();
    if (keyword.length < 1) {
      return $(resultsList).slideUp();
    }
    // search db with keyword
    return searchPersons(keyword);
  });

  // handle csv uploads
  $(uploadForm).on("submit", function(event) {
    event.preventDefault();
    // shift focus to the search box
    // $(searchField).focus();
    // hide message box
    $(uploadMessage).hide();
    // show progress bar
    $(progressContainer).show();
    // get file to be uploaded
    const file = document.getElementById(uploadField).files[0];
    // check if valid file type
    if (!file.type.includes("csv")) {
      const message = `<div class="alert alert-danger">You can only upload CSV files</div>`;
      $(uploadMessage)
        .html(message)
        .show("slow");
      return hideUploadMessages();
    }

    // create form data to be sent
    const formData = new FormData();
    formData.append("file", file);

    // create xhr request
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.response);
        if (xhr.status === 200) {
          // handle success
          progressBar.style.backgroundColor = "green";
          const successMessage = `<div class="alert alert-success">${
            response.message
          }</div>`;
          return $(uploadMessage)
            .html(successMessage)
            .show("slow");
        } else {
          // handle error
          progressBar.style.backgroundColor = "red";
          const errorMessage = `<div class="alert alert-danger">${
            response.message
          }</div>`;
          return $(uploadMessage)
            .html(errorMessage)
            .show("slow");
        }
      }
      return hideUploadMessages();
    };
    xhr.upload.addEventListener("progress", showProgress);
    xhr.open("POST", createPersonsUrl, true);
    xhr.send(formData);
  });
});
