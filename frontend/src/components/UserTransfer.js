import React, { useState } from 'react';
import axios from 'axios';
import './styling/UserTransfer.css';

const UserTransfer = () => {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/maschain/transfer', {
        sender,
        receiver,
        amount,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error transferring tokens:', error);
      setMessage('Failed to transfer tokens: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="token-transfer-container">
      <h1>Transfer Tokens</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="sender">Sender Address:</label>
        <input
          type="text"
          id="sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          required
        />
        <label htmlFor="receiver">Receiver Address:</label>
        <input
          type="text"
          id="receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          required
        />
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Transfer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserTransfer;
