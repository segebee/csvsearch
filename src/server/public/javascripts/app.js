// declare constants
const searchPersonsUrl = "/search";
const importPersonsUrl = "/import";
const searchField = "#searchField";
const searchResults = "#searchResults";
const searchItem = ".search-result-item";
const resultsList = "#resultsList";
const resultDetails = "#resultDetails";
const uploadForm = "#uploadForm";
const uploadButton = "#uploadButton";
const uploadField = "uploadField";
const status = "#status";
const uploadMessage = "#uploadMessage";
const progressContainer = ".progress";
const progressBar = document.getElementById("progressbar");
const transitionDelay = 1000;

// run when document is loaded
$(document).ready(function() {
  // handle search
  $(searchField).on("keyup paste", function(e) {
    // detect escape key and hide the autocomplete
    if (e.key === "Escape") {
      // hide search item details element
      return $(resultsList).slideUp();
    }
    // hide search item details element
    $(resultDetails).slideUp();
    const query = $(this).val();
    if (query.length < 1) {
      return $(resultsList).slideUp();
    }
    // search db with query
    return searchPersons(query);
  });

  // handle csv uploads
  $(uploadForm).on("submit", function(event) {
    event.preventDefault();
    // disable the upload button so it cannot be clicked during upload
    $(uploadButton).prop("disabled", true);
    // shift focus to the search box
    // $(searchField).focus();
    // hide message box
    $(uploadMessage).hide();

    // get file to be uploaded
    const file = document.getElementById(uploadField).files[0];
    // check if valid file type
    if (!file.type.includes("csv")) {
      const response = {};
      response.message = `You can only upload CSV files`;
      return renderMessage(response, "error", uploadMessage);
    }
    // show progress bar
    $(progressContainer).show();

    // create form data to be sent
    const formData = new FormData();
    formData.append("file", file);

    // create xhr request
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", showProgress);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200)
          return renderMessage(
            JSON.parse(xhr.response),
            "success",
            uploadMessage
          );

        return renderMessage(
          { message: "A network error occured: " + xhr.statusText },
          "error",
          uploadMessage
        );
      }
    };
    xhr.open("POST", importPersonsUrl, true);
    xhr.send(formData);
  });
});

/**
 * Functions to handle search
 */

// fetch the list of persons using query
function searchPersons(query) {
  $.post(searchPersonsUrl, { query }).done(function(resp) {
    if (resp.error) {
      // handle error
      const errorMessage = `<li style="color:red">${resp.message}</li>`;
      return $(resultsList)
        .html(errorMessage)
        .slideDown("slow");
    }
    // pass data returned to function rendering autocomplete
    return renderAutoComplete(resp.results);
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
  result.forEach((result, index) => {
    list += `<li id="result-${index}" class="search-result-item" data-name="${
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

/**
 * Functions to handle file uploads
 */

// display upload progress
function showProgress(evt) {
  // get file upload progress stage
  const progress = (evt.loaded / evt.total) * 100;
  // update progressBar width
  progressBar.style.width = progress + "%";
  if (progress === 100) {
    // hide the progress bar
    hideProgressBar();
  }
}

function hideProgressBar() {
  setTimeout(() => {
    $(progressContainer).hide();
    // show loader
    $(status).show();
    return resetProgressBar();
  }, transitionDelay);
}

function resetProgressBar() {
  progressBar.style.width = 0;
}

// render msg returned from the server
function renderMessage(response, type, messageElement) {
  // display message in DOM
  setTimeout(() => {
    // hide status
    $(status).hide();
    let message;
    // generate message based on response
    if (type === "success") {
      message = `<div class="alert alert-success">${response.message}</div>`;
    } else {
      message = `<div class="alert alert-danger">${response.message}</div>`;
    }
    // enable upload buttton
    $(uploadButton).prop("disabled", false);
    // show the message
    return $(messageElement)
      .html(message)
      .fadeIn("slow");
  }, transitionDelay);
}
