import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ShareButton = () => {
    const appId = '537985784317073';
    const redirectUri = 'http://localhost:3000/callback';  // Change to your redirect URI
    // const history = useHistory();

    const handleLogin = () => {
        const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
        window.location.href = authUrl;
    };

    return (
        <button onClick={handleLogin}>Share on Instagram</button>
    );
};

const Callback = () => {
    const location = useLocation();
    // const history = useHistory();

    useEffect(() => {
        const fetchAccessToken = async () => {
            const code = new URLSearchParams(location.search).get('code');
            if (code) {
                try {
                    const response = await axios.get(`http://localhost:3001/auth?code=${code}`);
                    const { accessToken } = response.data;
                    const postId = 'YOUR_POST_ID';  // Replace with the actual post ID

                    // Send the access token and post ID to your backend
                    await axios.post('http://localhost:3001/share', {
                        accessToken,
                        postId
                    });

                    alert('Post shared successfully!');
                    // history.push('/');  // Redirect to home or another page
                } catch (error) {
                    console.error('Error sharing post:', error);
                    alert('Failed to share post.');
                }
            }
        };

        fetchAccessToken();
    }, [location]);

    return (
        <div>Logging in...</div>
    );
};

export { ShareButton, Callback };
