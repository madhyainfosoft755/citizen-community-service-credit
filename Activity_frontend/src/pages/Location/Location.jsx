// // import React, { useEffect, useState } from 'react';
// // import { useHistory } from 'react-router-dom';

// // function Location() {
// //   const [currentLocation, setCurrentLocation] = useState(null);
// //   // const history = useHistory();

// //   useEffect(() => {
// //     // Check if geolocation is supported by the browser
// //     if ('geolocation' in navigator) {
// //       // Request the current position from the browser
// //       navigator.geolocation.getCurrentPosition(
// //         async (position) => {
// //           const { latitude, longitude } = position.coords;

// //           // Reverse geocoding using Google Maps Geocoding API
// //           try {
// //             const response = await fetch(
// //               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
// //             );
// //             if (response.ok) {
// //               const data = await response.json();
// //               const address = data.results[0]?.formatted_address || 'Address not found';
// //               setCurrentLocation({ latitude, longitude, address });
// //             } else {
// //               console.error('Error fetching address:', response.statusText);
// //             }
// //           } catch (error) {
// //             console.error('Error fetching address:', error);
// //           }
// //         },
// //         (error) => {
// //           console.error('Error getting location:', error);
// //         }
// //       );
// //     } else {
// //       console.error('Geolocation is not supported by your browser');
// //     }
// //     setCurrentLocation({ latitude, longitude, address });

// //   }, []);
// //   const navigateToNextPage = () => {
// //     history.push('/create', { location: currentLocation });
// //   };

// //   return (
// //     <div>
// //       {currentLocation ? (
// //         <p>
// //           Current Address: {currentLocation.address}
// //           <br />
// //           <button onClick={navigateToNextPage}>Go to Next Page</button>
// //         </p>
// //       ) : (
// //         <p>Loading location...</p>
// //       )}
// //     </div>
// //   );
// // }

// // export default Location;

// // Location.js
// // import React, { useEffect, useState } from 'react';

// // function Location({ onLocationChange }) {
// //   const [currentLocation, setCurrentLocation] = useState(null);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     if ('geolocation' in navigator) {
// //       navigator.geolocation.getCurrentPosition(
// //         async (position) => {
// //           const { latitude, longitude } = position.coords;

// //           try {
// //             const response = await fetch(
// //               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&bounds=lat1,long1|lat2,long2&key=${process.env.REACT_APP_GoogleGeocode}`
// //             );
// //             // console.log(response);
// //             if (response.ok) {
// //               console.log(response);
// //               const data = await response.json();
// //               console.log("the location data is here",data)

// //               const address = data.results[0]?.formatted_address || 'Address not found';
// //               // const latitude = data.results[5]?.geometry.location.lat || 'latitude not found'
// //               setCurrentLocation({ latitude, longitude, address });
// //               onLocationChange(address); // Notify parent component about the address change
// //             } else {
// //               console.error('Error fetching address:', response.statusText);
// //             }
// //           } catch (error) {
// //             console.error('Error fetching address:', error);
// //           }
// //         },
// //         (error) => {
// //           console.error('Error getting location:', error);
// //         }
// //       );
// //     } else {
// //       console.error('Geolocation is not supported by your browser');
// //     }
// //   }, []);

// //   return (
// //     <div style={{ height: '', width: '' }}>
// //       {currentLocation ? (
// //         <p>
// //           {currentLocation.address} <br />
// //         </p>
// //       ) : (
// //         <p>Loading location...</p>
// //       )}
// //     </div>
// //   );
// // }

// // export default Location;

// import React, { useEffect, useState } from 'react';

// function Location({ onLocationChange }) {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showCoordinates, setShowCoordinates] = useState(false); // State to control showing coordinates

  
//   useEffect(() => {
//     let isMounted = true;

//     const fetchLocation = async () => {
//       try {
//         if ('geolocation' in navigator) {
//           navigator.geolocation.getCurrentPosition(
//             async (position) => {
//               const { latitude, longitude } = position.coords;

//               const response = await fetch(
//                 `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GoogleGeocode}`
//               );

//               if (response.ok && isMounted) {
//                 const data = await response.json();
//                 // console.log("hey data dikh rha hai",data)
//                 const addressComponents = data.results[0]?.address_components || [];
//                 const city = addressComponents.find(comp => comp.types.includes('locality'))?.long_name || 'City not found';
//                 const state = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || 'State not found';
//                 const address = `${city}, ${state}`;
//                 setCurrentLocation({ latitude, longitude, address });
//                 onLocationChange({ latitude, longitude, address }); // Send latitude, longitude, and address to the parent component
//               } else if (!isMounted) {
//                 console.log('Component is unmounted');
//               } else {
//                 throw new Error('Error fetching address:', response.statusText);
//               }
//             },
//             (error) => {
//               throw new Error('Error getting location:', error);
//             }
//           );
//         } else {
//           throw new Error('Geolocation is not supported by your browser');
//         }
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         if (isMounted) setIsLoading(false);
//       }
//     };

//     fetchLocation();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const toggleCoordinates = () => {
//     setShowCoordinates(!showCoordinates);
//   };

//   console.log("ye hain coordinates", showCoordinates)

//   return (
//     <div style={{ height: '', width: '' }}>
//       {isLoading ? (
//         <p>Loading location...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : currentLocation ? (
//         <button onClick={toggleCoordinates}>
//           {showCoordinates ? `${currentLocation.latitude}, ${currentLocation.longitude}` : `${currentLocation.address}`}
//         </button>
//       ) : null}
//     </div>
//   );
// }

// export default Location;


//all the codes that are commented above are in working condition



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
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&bounds=lat1,long1|lat2,long2&key=${process.env.REACT_APP_GoogleGeocode}`
            );
            // console.log(response);
            if (response.ok) {
              // console.log(response);
              const data = await response.json();
              // console.log("the location data is here",data)

              const address = data.results[0]?.formatted_address || 'Address not found';
              // const latitude = data.results[5]?.geometry.location.lat || 'latitude not found'
              setCurrentLocation({ latitude, longitude, address });
              onLocationChange(latitude,longitude); // Notify parent component about the address change
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
          {currentLocation.latitude}, <br />
          {currentLocation.longitude} <br />

        </p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}

export default Location;