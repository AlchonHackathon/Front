import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styling/ResetPasswordModal.css';

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setStep(1);
    setUserId('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
  };

  const handleUserIdSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/users/security-question/${userId}`);
      setSecurityQuestion(response.data.securityQuestion);
      setStep(2);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching security question');
    }
  };

  const handleSecurityAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/verify-security-answer', { userId, securityAnswer });
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error verifying security answer');
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/api/users/reset-password', { userId, newPassword });
      setMessage(response.data.message);
      resetState();
      onClose();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {step === 1 && (
          <form onSubmit={handleUserIdSubmit}>
            <h2>Reset Password</h2>
            <div className="form-group">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="modal-button">Next</button>
              <button type="button" className="modal-button" onClick={onClose}>Close</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSecurityAnswerSubmit}>
            <h2>Answer Security Question</h2>
            <div className="form-group">
              <label htmlFor="securityAnswer">{securityQuestion}</label>
              <input
                type="text"
                id="securityAnswer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="modal-button">Next</button>
              <button type="button" className="modal-button" onClick={onClose}>Close</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordResetSubmit}>
            <h2>Enter New Password</h2>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="modal-button">Reset Password</button>
              <button type="button" className="modal-button" onClick={onClose}>Close</button>
            </div>
          </form>
        )}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
