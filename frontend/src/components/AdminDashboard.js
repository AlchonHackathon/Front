import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './styling/AdminDashboard.css';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');

  const headers = {};
  if (token) {
      headers['Authorization'] = `Bearer ${token}`;
  }

  const USERS_URL = '/api/user';
  
  const [user, setUser] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${USERS_URL}/me`, {
                signal: controller.signal,
                headers: headers,
            });
            setUser(response.data.user);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.error(`Fetch user request cancelled`);
            }
            else {
                console.error(`Error getting user:` , error);
            }
        }
    }; 

    fetchUser();

    return () => {
        controller.abort();
    };
  }, []);


  
  
return (
  <div className = "AdminDashboard-wrapper">

<body>
  <div className="AdminDashboard-header">
      <h1>{user.name}</h1>
  </div>
  <div className="AdminDashboard-panel">
   
  </div>
</body>
    </div>
  )
}

export default AdminDashboard;