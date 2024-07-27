import React from 'react';
import { Link } from 'react-router-dom'

import './styling/Login.css';

const ForgetPassword = () => {
  return (
    <>
      <div className='Login-wrapper'>
      <body className='Login-body'>
          <div class="login-container">
            <h1 class='login-h1'>Forget Password</h1>
            <form class='login-form' action="#">
              <div class="login-form-group">
                <label class='login-label, login-left' for="email">Email</label>
                <input type="text" id="email" name="email" placeholder="Email" />
                <p className="p_black">Input email for password reset</p>
              </div>
              <Link to="/login">
                <button class='login-button' type="submit">Send Password</button>
              </Link>
            </form>
          </div>
        </body>
        </div>
        </>
  )
}

export default ForgetPassword;