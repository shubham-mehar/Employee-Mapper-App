import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const EmployeeMap = () => {
  const [address, setAddress] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const formRef = useRef(null);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleAddUser = (event) => {
    event.preventDefault(); 
    const name = event.target.name.value;
    const department = event.target.department.value;
    const address = event.target.address.value;
    const location = event.target.location.value;
    const latitude = event.target.latitude.value;
    const longitude = event.target.longitude.value;

    const newEmployee = {
      name,
      dept: department,
      address: address,
      location,
      geoCoordinates: {
        latitude,
        longitude,
      },
    };

    fetch('https://employee-mapper-api.onrender.com/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Added employee:', data);
        window.alert('Employee has been added to the database');
        formRef.current.reset();
      })
      .catch((error) => {
        window.alert('Error! occured while adding employee to database ');
        console.error('Error adding employee:', error);
      });
  };

  const handleUpdateLocation = (employeeId) => {
    fetch(`https://employee-mapper-api.onrender.com/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newAddress: address }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Updated employee:', data);
        setUpdateStatus('Employee information updated');
        window.alert('Employee address has been updated! the database');
        setAddress('');
      })
      .catch((error) => {
        console.error('Error updating employee:', error);
        window.alert('Error updating employee!');
        setUpdateStatus('Failed to update employee information');
      });
  };

  useEffect(() => {
    let map = null;
    let markerCluster = null;

    try {
      map = L.map('map', {
        center: [51.505, -0.09],
        zoom: 5,
        maxZoom: 18,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      setTimeout(() => {
        markerCluster = L.markerClusterGroup();

        fetch('https://employee-mapper-api.onrender.com/employees')
          .then((response) => response.json())
          .then((data) => {
            const markers = data.map((employee) => {
              if (
                employee.geoCoordinates &&
                typeof employee.geoCoordinates.latitude === 'number' &&
                typeof employee.geoCoordinates.longitude === 'number'
              ) {
                const marker = L.marker([
                  employee.geoCoordinates.latitude,
                  employee.geoCoordinates.longitude,
                ]);

                marker.bindPopup(`
                  <div style="max-width: 300px;">
                    <h4>Employee ID: ${employee._id}</h4>
                    <p>Name: ${employee.name}</p>
                    <p>Department: ${employee.dept}</p>
                    <p>Address: ${employee.address}</p>
                    <p>Location: ${employee.location}</p>
                    <p>Geo Coordinates:</p>
                    <ul>
                      <li>Latitude: ${employee.geoCoordinates.latitude}</li>
                      <li>Longitude: ${employee.geoCoordinates.longitude}</li>
                    </ul>
                  </div>
                `);

                return marker;
              }

              return null;
            });

            markerCluster.addLayers(markers.filter((marker) => marker !== null));
            map.addLayer(markerCluster);
          })
          .catch((error) => console.log('Error:', error));
      }, 1000);
    } catch (error) {
      console.log('Error initializing map:', error);
    }

    return () => {
      if (map) {
        map.remove();
      }
      if (markerCluster) {
        markerCluster.remove();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', margin:"20px" }}>
      <div style={{ flex: 1, padding: '20px', marginRight: '0px', backgroundColor: '#f2f2f2' }}>
        <h2 style={{marginBottom:"5px"}}>Employee Actions</h2>
        <form ref={formRef} onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
          <input type="text" id="name" name="name" placeholder="Name" style={{ marginBottom: '10px', padding:   '8px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', }}/>
          <input type="text" id="department" name="department" placeholder="Department" style={{
          marginBottom: '10px',  padding: '8px', width: '100%', boxSizing: 'border-box',  border: '1px solid #ccc',  borderRadius: '4px'}}        />
          <input type="text" id="address" name="address" placeholder="Address"  style={{ marginBottom: '10px', padding: '8px', width: '100%', boxSizing: 'border-box', border: '1px solid #ccc',
              borderRadius: '4px'}} />
          <input type="text" id="location" name="location" placeholder="Location" style={{ marginBottom: '10px',padding: '8px',width: '100%',boxSizing:'border-box',border: '1px solid #ccc',borderRadius: '4px'}}/>
          <p>Geo Coordinates:</p>
          <input type="text" id="latitude" name="latitude" placeholder="Latitude" style={{marginBottom:'10px',padding: '8px',width: '100%',boxSizing:'border-box',border:'1px solid #ccc', borderRadius:'4px'}}/>
          <input type="text" id="longitude" name="longitude" placeholder="Longitude" style={{ marginBottom: '10px', padding: '8px', width: '100%', boxSizing: 'border-box', border:  '1px solid #ccc', borderRadius: '4px'} } />
          <button type="submit" style={{ backgroundColor: '#008CBA', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', }}>
            Add Employee
          </button>
        </form>
        <h2 style={{marginBottom:"5px"}}>Update Employee Location</h2>
        <form onSubmit={(event) => { event.preventDefault();  handleUpdateLocation(selectedEmployee); }}>
          <input style={{marginBottom: '10px', padding: '8px', width: '100%', boxSizing: 'border-box', border: ' 1px solid #ccc', borderRadius: '4px' }} type="text" id="employeeId" name="employeeId" placeholder="Employee ID" value={selectedEmployee || ''} onChange={(event) => setSelectedEmployee(event.target.value)} />
          <input type="text" id="address" name="address" placeholder="New Address" value={address} onChange={handleAddressChange} style={{ marginBottom: '10px', padding: '8px',  width: '100%', boxSizing: 'border-box', border: '1px solid #ccc' , borderRadius: '4px', }}/> 
          <button type="submit"style={{backgroundColor: '#008CBA',color: 'white', padding: '8px 16px',border: 'none', borderRadius: '4px', cursor: 'pointer', }} >
             Update Location
          </button>
          <p>{updateStatus}</p>
        </form>
      </div>
      <div id="map" style={{ flex: 2 }}></div>
    </div>
  );
};

export default EmployeeMap;