import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styling/Login.css';
import ErrorModal from './ErrorModal'; // Import ErrorModal

const Login = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Add state for ErrorModal
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
        const response = await axios.post('/api/verification/send-code', { email });
        alert(response.data.message);
        setIsCodeSent(true);
    } catch (error) {
        console.error('Error sending code:', error);
        setError('Failed to send code: ' + (error.response?.data?.message || error.message));
        setIsErrorModalOpen(true); // Show ErrorModal
    }
};

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/verification/verify-code', { email, code: verificationCode });

      if (response.data.message === 'Verification successful.') {
        localStorage.setItem('email', email); // Store email or token as needed
        navigate('/user-dashboard');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Failed to verify code: ' + (error.response?.data?.message || error.message));
      setIsErrorModalOpen(true); // Show ErrorModal
    }
  };

  return (
    <div className='Login-wrapper'>
      <div className='Login-body'>
        <div className="login-container">
          <h1 className='login-h1'>Login</h1>
          {!isCodeSent ? (
            <div className="login-form-group">
              <label className='login-label login-left' htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className='login-button' onClick={handleSendCode}>Send Verification Code</button>
            </div>
          ) : (
            <form className='login-form' onSubmit={handleVerifyCode}>
              <div className="login-form-group">
                <label className='login-label login-left' htmlFor="verificationCode">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  placeholder="Enter the code sent to your email"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button className='login-button' type="submit">Log In</button>
            </form>
          )}
          <center><p className='login-p'>New? <Link className='login-a' to="/signup">Create Account</Link></p></center>
          {error && <ErrorModal isOpen={isErrorModalOpen} message={error} onClose={() => setIsErrorModalOpen(false)} />} {/* Use ErrorModal */}
        </div>
      </div>
    </div>
  );
};

export default Login;
