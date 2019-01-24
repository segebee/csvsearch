# CSV SEARCH

This application makes it easy to search through CSV data. A user can upload a CSV in an expected format and the CSV is stored in the database and can be searched through using a search field provided.

## SETUP

- install package dependencies by running _npm install_

* ensure a MongoDB server is running
* start the application by running _npm start_ . this runs the application on port 3000 by default. To specify the PORT, start the application by running _PORT=PORT_NUMBER npm start_
* navigate to http://localhost:3000 or http://localhost:PORT_NUMBER in your browser to use the application

### Dependencies

The application requires a running MongoDB instance as the database in use is MongoDB. Package dependencies are automatically installed in the setup phase

### Notes

The approach was to ensure the app uses minimal memory when processing files. Streams was used to achieve this.
On the front end, javascript and JQuery were used to show the developers knowledge of both technologies.
Errors and edge cases were captured.
Animations for added for a pleasant experience.
Attention was paid greatly to UX.
