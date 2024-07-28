import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styling/UserTransfer.css';

const UserTransfer = () => {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [receiverOptions, setReceiverOptions] = useState([]);
  const [sender_address, setSenderAddress] = useState('');
  const [receiver_address, setReceiverAddress] = useState('');
  const [current_balance, setCurrentBalance] = useState('');
  const [isSenderAddressFetched, setIsSenderAddressFetched] = useState(false);
  const [isBalanceUpdateNeeded, setIsBalanceUpdateNeeded] = useState(false);

  const API_URL = 'https://service-testnet.maschain.com';
  const CLIENT_ID = 'dcc67b1d4f9c7db2483e7823e14a4bfb28ee87e96abb857e57febbcba16836db';
  const CLIENT_SECRET = 'sk_07bdb646220d6ca9081ab8bead4ea41e2c1f0fb0a7ea2d992faa9f119e5a25ba';
  const CONTRACT_ADDRESS = '0xD550695F36D1Eb598627a9827b3364E9F5D4e3E5';
  const CALLBACK_URL = 'https://postman-echo.com/post?';

  const fetchBalance = async () => {
    try {
      console.log('Fetching balance for:', sender_address);
      const response = await axios.post(`${API_URL}/api/token/balance/`, {
        wallet_address: sender_address,
        contract_address: CONTRACT_ADDRESS,
      },
      {
        headers: {
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET
        }
      });

      console.log('Balance response:', response.data.result);
      setCurrentBalance(response.data.result);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setMessage('Failed to retrieve balance: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    // Fetch sender address when the component mounts
    const fetchSenderAddress = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/wallet/wallet/0x378ec8591F721Bc7B2bCEa3DD2bF9A11E68E4752`, {
          headers: {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
          }
        });
        setSender(response.data.result.name);
        setSenderAddress(response.data.result.address);
        setIsSenderAddressFetched(true);
      } catch (error) {
        console.error('Error fetching sender address:', error);
        setMessage('Failed to retrieve sender address: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchSenderAddress();
  }, []);

  useEffect(() => {
    // Fetch receiver options
    const fetchReceiver = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/wallet/wallet/`, {
          headers: {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
          }
        });

        const receivers = response.data.result
          .map(item => item.name)
          .filter(name => name !== null && name !== sender);

        setReceiverOptions(receivers);
        if (receivers.length > 0) {
          setReceiver(receivers[0]);
        }
      } catch (error) {
        console.error('Error fetching receiver:', error);
        setMessage('Failed to retrieve receiver: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchReceiver();
  }, [sender]);

  useEffect(() => {
    // Fetch receiver addresses when `receiver` state changes
    const fetchReceiverAddress = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/wallet/wallet/`, {
          headers: {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
          }
        });

        const result = response.data.result || [];
        const addresses = result
          .filter(item => item.name === receiver)
          .map(item => item.address);

        setReceiverAddress(addresses);
      } catch (error) {
        console.error('Error fetching receiver addresses:', error);
        setMessage('Failed to retrieve receiver addresses: ' + (error.response?.data?.message || error.message));
      }
    };

    if (receiver) {
      fetchReceiverAddress();
    }
  }, [receiver]);

  // Get current balance
  useEffect(() => {
    if (isSenderAddressFetched || isBalanceUpdateNeeded) {
      fetchBalance();
      setIsBalanceUpdateNeeded(false);  // Reset the balance update flag
    }
  }, [isSenderAddressFetched, isBalanceUpdateNeeded]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Transferring tokens:', {
        wallet_address: sender_address,
        to: receiver_address[0],
        amount: amount,
        contract_address: CONTRACT_ADDRESS,
        callback_url: CALLBACK_URL
      });

      const response = await axios.post(`${API_URL}/api/token/token-transfer`, {
        wallet_address: sender_address,
        to: receiver_address[0],
        amount: amount,
        contract_address: CONTRACT_ADDRESS,
        callback_url: CALLBACK_URL
      }, {
        headers: {
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET
        }
      });

      setMessage('Transfer successful');

      console.log('Waiting 3 seconds before fetching updated balance...');
      setTimeout(async () => {
        console.log('Fetching updated balance...');
        await fetchBalance();
      }, 3000);
    } catch (error) {
      console.error('Error transferring tokens:', error);
      setMessage('Failed to transfer tokens: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="token-transfer-wrapper">
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
          <label htmlFor="current_balance">Available Balance:</label>
          <input
            type="text"
            id="current_balance"
            value={current_balance}
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
          <div className="buttonSubmit">
            <button type="submit">Transfer</button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default UserTransfer;
