import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { currentLinkAction } from '../actions';
import './styling/header.css';
import bell from '../icons/bell.png';
import briefcase from '../icons/briefcase.png';
import document from '../icons/document.png';
import home from '../icons/home.png';
import mail from '../icons/mail.png';
import monitor from '../icons/monitor.png';
import search from '../icons/search.png';

// Importing components
import UserDashboard from './UserDashboard';

class UserHeader extends React.Component {
  componentDidMount() {
    const path = window.location.pathname;
    const route = path.split('/').pop();
    console.log('Current route:', route);
    const routeActionMap = {
      'User-portfolioConfig': this.updatePCLinkState,
      'User-dashboard': this.updateDLinkState,
    };

    if (routeActionMap[route]) {
      console.log('Updating link state for route:', route);
      routeActionMap[route]();
    } else {
      console.log('No matching route found for:', route);
    }
  }

  updatePCLinkState = () => {
    console.log('Updating link state to User-portfolioConfig');
    this.props.currentLinkAction('User-portfolioConfig');
  }

  updateDLinkState = () => {
    console.log('Updating link state to User-dashboard');
    this.props.currentLinkAction('User-dashboard');
  }

  getTitle = () => {
    const { currentLinkState } = this.props;
    const titles = {
      'User-portfolioConfig': 'Portfolio Configuration',
      'User-dashboard': 'Dashboard',
    };
    return titles[currentLinkState] || 'Dashboard';
  }

  render() {
    console.log('Rendering UserHeader with current link state:', this.props.currentLinkState);
    return (
      <div className="header-wrapper">
        <div className="topbar">
          <div className="left-topbar">
            <Link to="/User-profile" id="User-profile" onClick={this.updatePLinkState} className="profilePictureIcon">
              pp
            </Link>
            <div>
              <img src={bell} className="icon-st notificationIcon icon-ltb" alt="Notifications" />
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
            <div className="labSearchingList">
              <div className="header-l">
                Lab Searching
              </div>
              <Link to="/User-portfolioConfig" id="User-portfolioConfig" onClick={this.updatePCLinkState} className="subtopic">
                <img className="icon-st" src={briefcase} alt="Portfolio" />
                <p className="title-st">
                  PORTFOLIO CONFIG
                </p>
              </Link>
            </div>
            <div className="labManagementList">
              <div className="header-l">
                Lab Management
              </div>
              <Link to="/User-dashboard" id="User-dashboard" onClick={this.updateDLinkState} className="subtopic">
                <img className="icon-st" src={home} alt="Dashboard" />
                <p className="title-st">
                  DASHBOARD
                </p>
              </Link>
            </div>
          </div>
          <div className="main">
            <Routes>
              <Route path="/User-portfolioConfig" element={<PortfolioConfiguration />} />
              <Route path="/User-dashboard" element={<UserDashboard />} />
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
