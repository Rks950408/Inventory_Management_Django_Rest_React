import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar bg-gray-800 text-white w-64 h-full p-4">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <ul>
        <li className="mb-2">
          <Link to="/" className="hover:text-gray-300">Item Master</Link>
        </li>
        <li className="mb-2">
          <Link to="/sale" className="hover:text-gray-300">Sale</Link>
        </li>
        <li className="mb-2">
          <Link to="/purchase" className="hover:text-gray-300">Purchase</Link>
        </li>
        <li className="mb-2">
          <Link to="/brand" className="hover:text-gray-300">Brand</Link>
        </li>
        <li className="mb-2">
          <Link to="/report" className="hover:text-gray-300">Report</Link>
        </li>
        <li className="mb-2">
          <Link to="/detailed-report" className="hover:text-gray-300">Detailed Report</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
