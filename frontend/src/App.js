import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Sidebar from './components/sidebar';
import Sale from './components/Sale';
import Purchase from './components/Purchase';
import Brand from './components/Brand';
import Report from './components/Report';
import DetailedReport from './components/DetailedReport';
import Header from './components/Header';
import ItemList from './components/Item_master/Item_list.jsx';
import AddItem from './components/Item_master/AddItem.jsx';

function App() {
  return (
    <Router>
       <Header />
      <div className="flex">
        {/* <Sidebar /> */}
        <div className="content flex-1 p-4">
          <Routes>
            <Route path="/item" element={<ItemList/>} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/report" element={<Report />} />
            <Route path="/detailed-report" element={<DetailedReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
