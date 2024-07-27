import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styling/UserDashboard.css';

const UserDashboard = () => {
  const token = localStorage.getItem('token');

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const USER_URL = '/api/users';

  const [user, setUser] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${USER_URL}/me`, {
          signal: controller.signal,
          headers: headers,
        });
        setUser(response.data.user);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.error(`Fetch reports request cancelled`);
        }
        else {
          console.error(`Error getting user:`, error);
        }
      }
    };


    fetchUser();

    return () => {
      controller.abort();
    };
  }, []);



  return (
    <div className="UserDashboard-wrapper">
      <body>
        <div class="UserDashboard-header">
          <h1>{user.name}</h1>
        </div>
        <div class="UserDashboard-panel">
        </div>
      </body>
    </div>
  )
}

export default UserDashboard;