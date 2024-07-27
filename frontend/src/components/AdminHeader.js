import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux'
import { currentLinkAction } from '../actions';

import './styling/header.css';

import bell from '../icons/bell.png'
import briefcase from '../icons/briefcase.png'
import document from '../icons/document.png'
import home from '../icons/home.png'
import mail from '../icons/mail.png'
import monitor from '../icons/monitor.png'
import search from '../icons/search.png'

// Admin Dashboard
import AdminDashboard from './AdminDashboard'
import App from './App';



class AdminHeader extends React.Component {

  componentDidMount(){
  if (window.location.href === 'http://localhost:3000/admin-dashboard') {
      this.props.currentLinkAction('admin-dashboard')
    }
  }

  updatePDLinkState = () => {
    this.props.currentLinkAction('admin-dashboard');
  }

  getTitle = () => {
    const { currentLinkState } = this.props;
    switch (currentLinkState) {
      case 'admin-dashboard':
        return 'Dashboard';
      default:
        return 'Dashboard';
    }
  }

  render(){
    return(
      // <Router>
        <div className="header-wrapper">
          <div className="topbar">

            <div className="left-topbar">
              <div>
                <img src={bell} className="icon-st notificationIcon icon-ltb"/>
              </div>
            </div>

            <div className="right-topbar">
              <p className="rtb-title">
                {this.getTitle()}
              </p>
            </div>

          </div>
          
          <div className="bottomContent">

            <div className="sidebar">
              <div className="List">

                <Link to="/admin-dashboard" id="admin-dashboard" onClick = {this.updatePDLinkState} className="subtopic">
                  <img className="icon-st" src={home}/>
                  <p className="title-st">
                    DASHBOARD
                  </p>
                </Link>

              </div>

            </div>

            <div className="main">
              <Routes>
                <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
              </Routes>
            </div>

          </div>
        </div>
      // </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return { currentLinkState: state.currentLinkState }
}

export default connect(mapStateToProps, { currentLinkAction })(AdminHeader)