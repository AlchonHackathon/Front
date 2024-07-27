import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { currentLinkAction } from '../actions';
import './styling/header.css';
import home from '../icons/home.png';
import nft from '../icons/nft.png';
import Sidebar from './Sidebar'

// Importing components
import UserDashboard from './UserDashboard';
import UserTransfer from './UserTransfer';

class UserHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarVisible: true,
    };
  }

  componentDidMount() {
    const path = window.location.pathname;
    const route = path.split('/').pop();
    console.log('Current route:', route);
    const routeActionMap = {
      'user-dashboard': this.updateDLinkState,
      'user-transfer': this.updateTLinkState,
    };

    if (routeActionMap[route]) {
      console.log('Updating link state for route:', route);
      routeActionMap[route]();
    } else {
      console.log('No matching route found for:', route);
    }
  }

  updateDLinkState = () => {
    console.log('Updating link state to User-dashboard');
    this.props.currentLinkAction('user-dashboard');
  }

  updateTLinkState = () => {
    console.log('Updating link state to User-transfer');
    this.props.currentLinkAction('user-transfer');
  }

  getTitle = () => {
    const { currentLinkState } = this.props;
    const titles = {
      'User-dashboard': 'Dashboard',
      'User-transfer': 'Transfer Tokens',
    };
    return titles[currentLinkState] || 'Dashboard';
  }

  toggleSidebar = () => {
    this.setState((prevState) => ({ isSidebarVisible: !prevState.isSidebarVisible }));
  }

  render() {
    console.log('Rendering UserHeader with current link state:', this.props.currentLinkState);

    return (
      <div className="header-wrapper">
        <div className="topbar">
          <button className="menu-btn" onClick={this.toggleSidebar}>☰</button>
          <p className="rtb-title">
            {this.getTitle()}
          </p>
        </div>

        <div className="bottomContent">
          {this.state.isSidebarVisible && (
            <div className="sidebar">
              <Sidebar
                updateDLinkState={this.updateDLinkState}
                updateTLinkState={this.updateTLinkState}
              />
            </div>
          )}
          <div className="main">
            <Routes>
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/user-transfer" element={<UserTransfer />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { currentLinkState: state.currentLinkState };
}

export default connect(mapStateToProps, { currentLinkAction })(UserHeader);
