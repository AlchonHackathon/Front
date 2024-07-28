import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { currentLinkAction } from '../actions';


import './styling/header.css';
import './styling/template.css';

import UserHeader from './UserHeader';
import AdminHeader from './AdminHeader';
import SignLogRouter from './SignLogRouter';


class App extends React.Component {
  componentDidMount() {
    const { pathname } = window.location;
    const linkState = pathname.split('/')[1];
    this.props.currentLinkAction(linkState);
  }

  renderHeader = () => {
    console.log("Hello");
    const { currentLinkState } = this.props;
    console.log(currentLinkState);
    if (typeof currentLinkState === 'string') {
      if (currentLinkState.startsWith('user-')) {
        return <UserHeader />;
      } else if (currentLinkState.startsWith('admin-')) {
        return <AdminHeader />;
      } else {
        return <SignLogRouter />;
      }
    }
    return null;
  }

  render() {
    return (
      <Router>
        {this.renderHeader()}
      </Router>
    );
  }

  
}

const mapStateToProps = (state) => {
  return { currentLinkState: state.currentLinkState };
}

export default connect(mapStateToProps, { currentLinkAction })(App);
