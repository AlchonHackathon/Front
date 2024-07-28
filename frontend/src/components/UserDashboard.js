import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styling/UserDashboard.css';


const UserDashboard = () => {
  const API_URL = 'https://service-testnet.maschain.com';
  const CLIENT_ID = 'dcc67b1d4f9c7db2483e7823e14a4bfb28ee87e96abb857e57febbcba16836db';
  const CLIENT_SECRET = 'sk_07bdb646220d6ca9081ab8bead4ea41e2c1f0fb0a7ea2d992faa9f119e5a25ba';
  const CONTRACT_ADDRESS = '0xD550695F36D1Eb598627a9827b3364E9F5D4e3E5';
  const CALLBACK_URL = 'https://postman-echo.com/post?';
  const WALLET_ADDRESS = '0x378ec8591F721Bc7B2bCEa3DD2bF9A11E68E4752'


  const token = localStorage.getItem('token');

  const headers = {};
  if (token) {
    // headers['Authorization'] = `Bearer ${token}`;

  }

  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {

        /* 
        const response = await axios.get(`${API_URL}/me`, {
          signal: controller.signal,
          headers: headers,
        });
        setUser(response.data.user);
        */

        // Fetch transaction history
        const transactionsResponse = await axios.get(`${API_URL}/api/token/get-token-transaction`, {
          params: {
            wallet_address: WALLET_ADDRESS,
            contract_address: CONTRACT_ADDRESS,
            filter: 'to'
          },
          headers: {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
          }
        });
        
        console.log(transactionsResponse.data.result);
        const result = transactionsResponse.map(response => ({
          to: response.to,
          amount: response.amount
        }));
        console.log(result);
        setTransactions(transactionsResponse.data.transactions);

      } catch (error) {
        if (axios.isCancel(error)) {
          console.error(`Fetch request cancelled`);
        } else {
          console.error(`Error fetching transaction history:`, error);
        }
      }
    };

    fetchUser();

    return () => {
      controller.abort();
    };
  });


  
  return (
    <div className="userDashboard-wrapper">
      <div className="userDashboard-panel">
        <div className="userDashboard-content">
          <h2>Transaction History</h2>
          <table>
            <thead>
              <tr>
                <th>To</th>
                <th>From</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.to}</td>
                  <td>{transaction.from}</td>
                  <td>{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
