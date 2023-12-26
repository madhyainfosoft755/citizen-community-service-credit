import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../Constant';
import { Card, Avatar } from 'antd';
import Createpost   from './DesktopThreePage';  
import DesktopTwoPage from './DesktopTwoPage'

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authorizationToken = localStorage.getItem('token');

    if (authorizationToken) {
      fetch(`${API_URL}/activity/profile`, {
        headers: {
          Authorization: `Bearer ${authorizationToken}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setUserData(data.userData);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  return (
    <div className="my-dashboard-container">
      {userData ? (
        <Card className="my-card">
          {/* Pass the picture and name props to DesktopThreePage */}
          <Createpost picture={userData.picture} name={userData.name} />
          <DesktopTwoPage picture={userData.picture} name={userData.name} />

        </Card>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Dashboard;
