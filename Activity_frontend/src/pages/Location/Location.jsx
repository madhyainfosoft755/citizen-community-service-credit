// import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';

// function Location() {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   // const history = useHistory();

//   useEffect(() => {
//     // Check if geolocation is supported by the browser
//     if ('geolocation' in navigator) {
//       // Request the current position from the browser
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;

//           // Reverse geocoding using Google Maps Geocoding API
//           try {
//             const response = await fetch(
//               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAn4eeaT18hannefB6jKR35GmY7iVdDCUs`
//             );
//             if (response.ok) {
//               const data = await response.json();
//               const address = data.results[0]?.formatted_address || 'Address not found';
//               setCurrentLocation({ latitude, longitude, address }); 
//             } else {
//               console.error('Error fetching address:', response.statusText);
//             }
//           } catch (error) {
//             console.error('Error fetching address:', error);
//           }
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by your browser');
//     }
//     setCurrentLocation({ latitude, longitude, address });
  
//   }, []); 
//   const navigateToNextPage = () => {
//     history.push('/create', { location: currentLocation });
//   };
  

//   return (
//     <div>
//       {currentLocation ? (
//         <p>
//           Current Address: {currentLocation.address}
//           <br />
//           <button onClick={navigateToNextPage}>Go to Next Page</button>
//         </p>
//       ) : (
//         <p>Loading location...</p>
//       )}
//     </div>
//   );
// }

// export default Location;





// Location.js
import React, { useEffect, useState } from 'react';

function Location({ onLocationChange }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAn4eeaT18hannefB6jKR35GmY7iVdDCUs`
            );
            if (response.ok) {
              const data = await response.json();
              const address = data.results[0]?.formatted_address || 'Address not found';
              setCurrentLocation({ latitude, longitude, address });
              onLocationChange(address); // Notify parent component about the address change
            } else {
              console.error('Error fetching address:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  }, []);

  return (
    <div style={{ height: '', width: '' }}>
      {currentLocation ? (
        <p>
          {currentLocation.address}
          <br />
        </p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}

export default Location;



