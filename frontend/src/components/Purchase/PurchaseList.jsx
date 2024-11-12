import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PurchasesList = () => {
  const navigate = useNavigate();
  const [purchaseData, setPurchaseData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8001/purchases/purchases-get/")
      .then((response) => {
        setPurchaseData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching purchase data:", error);
      });
  }, []);

  const handlePurchaseRedirect = () => {
    navigate("/purchase"); 
  };

  const handleViewClick = (id) => {
    axios
      .get(`http://127.0.0.1:8001/purchases/purchases/${id}/`)
      .then((response) => {
        navigate(`/purchase-details/${id}`, {
          state: { purchaseDetails: response.data },
        });
      })
      .catch((error) => {
        console.error("Error fetching purchase details:", error);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Purchases List</h1>

      <div className="mb-4">
        <button
          onClick={handlePurchaseRedirect} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Purchase Item
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-200">
            <th className="px-4 py-2 text-left border-b">S.No.</th>
            <th className="px-4 py-2 text-left border-b">Invoice Number</th>
            <th className="px-4 py-2 text-left border-b">Invoice Date</th>
            <th className="px-4 py-2 text-left border-b">Supplier</th>
            <th className="px-4 py-2 text-left border-b">Amount</th>
            <th className="px-4 py-2 text-left border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {purchaseData.map((purchase, index) => (
            <tr key={purchase.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{purchase.invoice_no}</td>
              <td className="px-4 py-2 border-b">{purchase.invoice_date}</td>
              <td className="px-4 py-2 border-b">{purchase.supplier_name}</td>
              <td className="px-4 py-2 border-b">₹ {purchase.total_amount}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleViewClick(purchase.id)} 
                  className="px-4 py-1 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchasesList;
