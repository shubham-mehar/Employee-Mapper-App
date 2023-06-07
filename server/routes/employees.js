import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

router.post('/employees', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employees' });
  }
});

router.put('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { newAddress } = req.body;
    console.log("req.params: ", req.params);
    console.log("req.body: ",req.body);

    // Fetch geocoding data from API
    const apiKey = process.env.API_KEY;
    const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      newAddress
    )}&apiKey=${apiKey}`;

    const response = await fetch(geocodingUrl);
    const data = await response.json();
    // console.log("goecoding Data :", data);
    // Extract latitude and longitude from the geocoding response
    const lon = data.features[0].geometry.coordinates[0];
    const lat = data.features[0].geometry.coordinates[1];
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    // console.log("Latitude: ",latitude," Longitude: ",longitude);

    const employee = await Employee.findByIdAndUpdate(
      id,
      { address: newAddress, 'geoCoordinates.latitude': latitude, 'geoCoordinates.longitude': longitude },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});


export default router;
