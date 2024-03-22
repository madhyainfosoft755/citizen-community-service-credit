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
// import React, { useEffect, useState } from 'react';

// function Location({ onLocationChange }) {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;

//           try {
//             const response = await fetch(
//               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&bounds=lat1,long1|lat2,long2&key=AIzaSyAn4eeaT18hannefB6jKR35GmY7iVdDCUs`
//             );
//             // console.log(response);
//             if (response.ok) {
//               console.log(response);
//               const data = await response.json();
//               console.log("the location data is here",data)
              
//               const address = data.results[0]?.formatted_address || 'Address not found';
//               // const latitude = data.results[5]?.geometry.location.lat || 'latitude not found'
//               setCurrentLocation({ latitude, longitude, address });
//               onLocationChange(address); // Notify parent component about the address change
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
//   }, []);

//   return (
//     <div style={{ height: '', width: '' }}>
//       {currentLocation ? (
//         <p>
//           {currentLocation.address} <br />
//         </p>
//       ) : (
//         <p>Loading location...</p>
//       )}
//     </div>
//   );
// }

// export default Location;



import React, { useEffect, useState } from 'react';

function Location({ onLocationChange }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              console.log("this is your current location",{latitude,longitude})

              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAn4eeaT18hannefB6jKR35GmY7iVdDCUs`
              );
              // console.log("this is the location response", response)
              if (response.ok && isMounted) {
                const data = await response.json();
                console.log("this is the data of the location" , data)

                const address = data.plus_code?.compound_code|| 'Address not found';
                setCurrentLocation({ latitude, longitude, address });
                onLocationChange(address);
              } else if (!isMounted) {
                console.log('Component is unmounted');
              } else {
                throw new Error('Error fetching address:', response.statusText);
              }
            },
            (error) => {
              throw new Error('Error getting location:', error);
            }
          );
        } else {
          throw new Error('Geolocation is not supported by your browser');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  

  return (
    <div style={{ height: '', width: '' }}>
      {isLoading ? (
        <p>Loading location...</p>
      ) : error ? (
        <p>{error}</p>
      ) : currentLocation ? (
        <p>
          {currentLocation.address} 
          <br />
        </p>
      ) : null}
    </div>
  );
}

export default Location;




