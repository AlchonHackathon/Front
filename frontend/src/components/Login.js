import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { currentLinkAction } from '../actions';
import axios from 'axios';
import './styling/Login.css';
import ResetPasswordModal from './ResetPasswordModal';
import ErrorModal from './ErrorModal'; // Import ErrorModal

const Login = ({ currentLinkAction }) => {

  const USER_URL = '/api/users';
  
  const initialState = {
    userId: '',
    password: '',
  };

  const [cred, setCred] = useState(initialState);
  const [error, setError] = useState(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Add state for ErrorModal
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCred(prevState => ({
      ...prevState, [name]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${USER_URL}/login`, cred);

      localStorage.setItem('token', response.data.token);
      if (response.data.type === 'student') {
        currentLinkAction('student-dashboard');
        navigate('/student-dashboard');

      } else if (response.data.type === 'professor') {
        currentLinkAction('professor-dashboard');
        navigate('/professor-dashboard');
      }
      
      setCred(initialState);

    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to login: ' + (error.response?.data?.message || error.message));
      setIsErrorModalOpen(true); // Show ErrorModal
    }
  }

  return (
      <div className='Login-wrapper'>
        <div className='Login-body'>
          <div className="login-container">
            <h1 className='login-h1'>Login</h1>
            <form className='login-form' onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label className='login-label login-left' htmlFor="userId">ID</label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  placeholder="Username"
                  value={cred.userId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-form-group">
                <label className='login-label' htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={cred.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="login-form-group-b">
                <Link className='login-a' to="#" onClick={(e) => {
                e.preventDefault();
                setIsResetPasswordModalOpen(true);
              }}>Forgot Password?</Link>             
              </div>
              <button className='login-button' type="submit">Log In</button>
              <center><p className='login-p'>New? <Link className='login-a' to="/signup">Create Account</Link></p></center>
            </form>
            {error && <ErrorModal isOpen={isErrorModalOpen} message={error} onClose={() => setIsErrorModalOpen(false)} />} {/* Use ErrorModal */}
          </div>
        </div>
        <ResetPasswordModal 
          isOpen={isResetPasswordModalOpen} 
          onClose={() => setIsResetPasswordModalOpen(false)} 
        />
      </div>
  );
};

const mapStateToProps = (state) => {
  return { currentLinkState: state.currentLinkState }
}

export default connect(mapStateToProps, { currentLinkAction })(Login);
