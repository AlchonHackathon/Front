// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import home from '../icons/home.png';
import nft from '../icons/nft.png';
import { motion } from 'framer-motion';

const Sidebar = ({ updateDLinkState, updateTLinkState }) => {
  return (
    <motion.div 
      className="sidebar"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="list">
        <Link to="/user-dashboard" id="user-dashboard" onClick={updateDLinkState} className="subtopic">
          <img className="icon-st" src={home} alt="Dashboard" />
          <p className="title-st">DASHBOARD</p>
        </Link>
        <Link to="/user-transfer" id="user-transfer" onClick={updateTLinkState} className="subtopic">
          <img className="icon-st" src={nft} alt="Transfer Tokens" />
          <p className="title-st">TRANSFER TOKENS</p>
        </Link>
      </div>
    </motion.div>
  );
};

export default Sidebar;
