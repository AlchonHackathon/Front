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
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${USER_URL}/me`, {
          signal: controller.signal,
          headers: headers,
        });
        setUser(response.data.user);

        // Fetch transaction history
        const transactionsResponse = await axios.get(`${USER_URL}/transactions`, {
          signal: controller.signal,
          headers: headers,
        });
        setTransactions(transactionsResponse.data.transactions);

      } catch (error) {
        if (axios.isCancel(error)) {
          console.error(`Fetch request cancelled`);
        } else {
          console.error(`Error fetching data:`, error);
        }
      }
    };

    fetchUser();

    return () => {
      controller.abort();
    };
  }, []);

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
