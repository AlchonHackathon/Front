import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux'
import { currentLinkAction } from '../actions';

import Login from './Login'
import Signup from './Signup'
import ForgetPassword from './ForgetPassword'

class SignLogRouter extends React.Component {

  // (prefix with Student on everything) Profile, Mail, Search Labs, Application List, Portfolio Configuration, Dashboard, Report Submission

  render(){
    return(
      // <Router>
        <div className="wrapper">
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element = {<Signup/>} />
                <Route path="/forgot-password" element = {<ForgetPassword/>} />
                <Route path="/" element={<Navigate to="/login" />} />

            </Routes>
        </div>
      // </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return { currentLinkState: state.currentLinkState }
}

export default connect(mapStateToProps, { currentLinkAction })(SignLogRouter)