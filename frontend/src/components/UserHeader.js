import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { currentLinkAction } from '../actions';
import './styling/header.css';
import home from '../icons/home.png';
import nft from '../icons/nft.png';

// Importing components
import UserDashboard from './UserDashboard';
import UserTransfer from './UserTransfer';

class UserHeader extends React.Component {
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

  render() {
    console.log('Rendering UserHeader with current link state:', this.props.currentLinkState);
    console.log('tokenlogo path:', nft); // Log the image source

    return (
      <div className="header-wrapper">
        <div className="topbar">
          <p className="rtb-title">
            {this.getTitle()}
          </p>
        </div>

        <div className="bottomContent">
          <div className="sidebar">
            <div className="list">
              <Link to="/user-dashboard" id="user-dashboard" onClick={this.updateDLinkState} className="subtopic">
                <img className="icon-st" src={home} alt="Dashboard" />
                <p className="title-st">
                  DASHBOARD
                </p>
              </Link>
              <Link to="/user-transfer" id="user-transfer" onClick={this.updateTLinkState} className="subtopic">
                <img className="icon-st" src={nft} alt="Transfer Tokens" />
                <p className="title-st">
                  TRANSFER TOKENS
                </p>
              </Link>
            </div>
          </div>
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
