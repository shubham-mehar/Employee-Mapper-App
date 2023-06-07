import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: String,
  dept: String,
  address: String,
  location: String,
  geoCoordinates: {
    latitude: Number,
    longitude: Number,
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
