import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styling/UserTransfer.css';

const UserTransfer = () => {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [receiverOptions, setReceiverOptions] = useState([]);

  const API_URL = 'https://service-testnet.maschain.com';
  const CLIENT_ID = 'dcc67b1d4f9c7db2483e7823e14a4bfb28ee87e96abb857e57febbcba16836db';
  const CLIENT_SECRET = 'sk_07bdb646220d6ca9081ab8bead4ea41e2c1f0fb0a7ea2d992faa9f119e5a25ba';

  /**
     * 
     * azrai test wallet id - 0x378ec8591F721Bc7B2bCEa3DD2bF9A11E68E4752
     * 
     * API_URL/api/wallet/wallet/{wallet adress sender} - get name
     * 
     * receiver wallet id - input
     * 
     * API_URL/api/wallet/wallet/{wallet adress receiver} - get name
    
       */
      
  useEffect(() => {
    // Fetch sender address when the component mounts
    const fetchSenderAddress = async () => {
      try {
        // Replace this with the actual API endpoint to get the sender's address
        const response = await axios.get(`${API_URL}/api/wallet/wallet/0x378ec8591F721Bc7B2bCEa3DD2bF9A11E68E4752`, {
          headers: {
                        'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
          }
        });
        setSender(response.data.result.name); // Assuming the response contains the address
        console.log(response)
      } catch (error) {
        console.error('Error fetching sender address:', error);
        setMessage('Failed to retrieve sender address: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchSenderAddress();
  }, []);

  useEffect(() => {
    // Fetch sender address when the component mounts
    const fetchReceiver = async () => {
      try {
        // Replace this with the actual API endpoint to get the sender's address
        const response = await axios.get(`${API_URL}/api/wallet/wallet/`, {
          headers: {
                        'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
          }
        });
        const receivers = response.data.result.map(item => item.name).filter(name => name !== null);

        
        setReceiverOptions(receivers); 
        if (receivers > 0) {
          setReceiver(receivers[0]); 
        }
        //setReceiver(response); // Assuming the response contains the address
        //console.log(response)
      } catch (error) {
        console.error('Error fetching retriever:', error);
        setMessage('Failed to retrieve retriever: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchReceiver();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Perform the transfer
      const response = await axios.post(`${API_URL}/api/maschain/transfer`, {
        sender,
        receiver,
        amount,
      }, {
        headers: {
          'Authorization': `Bearer ${CLIENT_SECRET}`
        }
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
          readOnly
        />
        <label htmlFor="receiver">Receiver Address:</label>
        <select
          id="receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        >
          <option value="">Select Receiver Address</option>
          {receiverOptions.map((address, index) => (
            <option key={index} value={address}>{address}</option>
          ))}
        </select>
        
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
