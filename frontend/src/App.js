import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Sidebar from './components/sidebar';
// import Sale from './components/Sale';
// import Purchase from './components/Purchase';
import Brand from './components/Brand';
// import Report from './components/Report';
// import DetailedReport from './components/DetailedReport';
import Header from './components/Header';
import ItemList from './components/Item_master/Item_list.jsx';
import AddItem from './components/Item_master/AddItem.jsx';
import BrandList from './components/Brand_master/BrandList.jsx';
import AddBrand from './components/Brand_master/AddBrand.jsx';
import Add_Supplier from './components/Supplier/Add_Supplier.jsx';
import Supplier_list from './components/Supplier/Supplier_list.jsx';
import PurchaseEntry from './components/Purchase/Purchase_Entry.jsx';
import SaleEntry from './components/sales/Sale_entry.jsx';
import ItemStockList from './components/Details/ItemStockList.jsx';
import DetailedList from './components/DetailsReport/DetailedList.jsx';
import PurchasesList from './components/Purchase/PurchaseList.jsx';
import PurchaseDetails from './components/Purchase/PurchaseDetails.jsx';

function App() {
  return (
    <Router>
      <Header />
      <div className="flex">
        {/* <Sidebar /> */}
        <div className="content flex-1 p-4">
          <Routes>
            <Route path="/item" element={<ItemList />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/brands" element={<BrandList />} />
            <Route path="/suppliers" element={<Add_Supplier />} />
            <Route path="/suppliers-list" element={<Supplier_list />} />

            <Route path="/add-brand" element={<AddBrand />} />
            <Route path="/sale" element={<SaleEntry />} />
            <Route path="/purchase-list" element={<PurchasesList />} />
            <Route path="/purchase-details/:id" element={<PurchaseDetails />} />
            <Route path="/purchase" element={<PurchaseEntry />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/report" element={<ItemStockList />} />
            <Route path="/detailed-report" element={<DetailedList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
