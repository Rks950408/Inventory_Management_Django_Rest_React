// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white p-4">
        <div className='flex justify-start b'>
        <h1 className="text-xl font-bold">Inventory Management</h1>

        </div>
        <div className='flex justify-end'>
        <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/item" className="font-bold">Item Master</Link>
          </li>
          <li>
            <Link to="/brands" className="font-bold">Brand</Link>
          </li>
          <li>
            <Link to="/sale" className="font-bold">Sale</Link>
          </li>
          <li>
            <Link to="/purchase" className="font-bold">Purchase</Link>
          </li>
          
          <li>
            <Link to="/report" className="font-bold">Report</Link>
          </li>
          <li>
            <Link to="/detailed-report" className="font-bold">Detailed Report</Link>
          </li>
        </ul>
      </nav>
        </div>
      
    </header>
  );
};

export default Header;
