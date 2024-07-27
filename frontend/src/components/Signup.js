import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styling/Signup.css';

const validateInput = (user) => {
  const { userId, email, password, type, securityQuestion, securityAnswer } = user;
  
  if (!userId || !email ) {
    return 'All fields are required';
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    return 'Invalid email format';
  }

  return null;
};

const Signup = () => {
  const USER_URL = '/api/users';

  const initialState = {
    userId: '',
    email: '',
  };

  const [user, setUser] = useState(initialState);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser(prevState => ({
      ...prevState, [name]: value
    }));
  }

  const getIDLabel = () => {
    return user.type === 'admin' ? 'Admin ID:' : 'User ID:';
  }

  const getIDPlaceholder = () => {
    return user.type === 'admin' ? 'Enter your admin ID:' : 'Enter your user ID';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInput(user);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const response = await axios.post(`${USER_URL}/signup`, user);
      alert(response.data.message);
      setUser(initialState);
    } catch (error) {
      console.error('Error signing up: ', error);
      alert('Failed to sign up: ' + error.message);
    }
  }

  return (
    <>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Sign Up</title>
    <link rel="stylesheet" href="style.css"/>
  </head>
  <div className='Signup-user-wrapper' >
  <body className='Signup-user-body'>
    <div className="Signup-user-container">
      <h1 className='Signup-user-h1'>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label for="type"></label>
        <select 
          className='Signup-user-select' 
          name="type" 
          id="type" 
          onChange = {handleChange} 
          value = {user.type}>
          <option value="" disabled>Select account type</option>  
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={user.email}
          onChange={handleChange}
        />

        <label htmlFor="userId">{getIDLabel()}</label>
        <input
          type="text"
          name="userId"
          id="userId"
          placeholder={getIDPlaceholder()}
          value={user.userId}
          onChange={handleChange}
        />

        <center><button className='Signup-user-button' type="submit">Create Account</button></center>
      </form>
      <center><p className='Signup-user-p'>Already have an account? <Link className='Signup-user-a' to="/login">Sign In</Link></p></center>
    </div>
  </body>
  </div>
</> 
  )
}

export default Signup;