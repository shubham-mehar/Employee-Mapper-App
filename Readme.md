# Employee Mapper App
Employee Mapper App is a web application that allows you to track and visualize the locations of employees in your organization on a map. It provides features to add new employees, update their locations, and view their details on the map.

## Features
- Add new employees: You can add new employees to the system by providing their name, department, address, location, and geo-coordinates.

- Update employee location: You can update the l*ocation of an employee by providing their employee ID and the new address. The application will automatically fetch the geocoding data and update the employee's geo-coordinates.

- Map visualization: The application displays a map using Leaflet library, showing markers for each employee's location. Clicking on a marker reveals the details of the employee, including their name, department, address, location, and geo-coordinates.

## Usage
- Add a new employee: Fill out the form with the employee's details including name, department, address, location, latitude, and longitude. Click the "Add Employee" button to add the employee to the system.

- Update employee location: Enter the employee ID and the new address in the update form. Click the "Update Location" button to update the employee's location. The application will fetch the geocoding data using the Geoapify API and update the employee's geo-coordinates.

- View employee details: Click on a marker on the map to view the details of the employee. The details include the employee's name, department, address, location, and geo-coordinates.

## Technologies Used
- React: Frontend JavaScript library for building user interfaces.
- Leaflet: JavaScript library for interactive maps.
- Geoapify: Geocoding API for converting addresses to geographic coordinates.
- Node.js: JavaScript runtime environment for server-side development.
- Express: Web application framework for Node.js.
- MongoDB: NoSQL database for storing employee data.