import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SaleList = () => {
  const navigate = useNavigate();
  const [saleData, setSaleData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8001/purchases/sales-get/")
      .then((response) => {
        setSaleData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });
  }, []);

  const handleSaleRedirect = () => {
    navigate("/sale"); // Redirect to add-sale page
  };

  const handleViewClick = (id) => {
    navigate(`/sale-details/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Sales List</h1>
      <div className="mb-4">
        <button
          onClick={handleSaleRedirect}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add Sale
        </button>
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-200">
            <th className="px-4 py-2 text-left border-b">S.No.</th>
            <th className="px-4 py-2 text-left border-b">Invoice Number</th>
            <th className="px-4 py-2 text-left border-b">Invoice Date</th>
            <th className="px-4 py-2 text-left border-b">Customer</th>
            <th className="px-4 py-2 text-left border-b">Amount</th>
            <th className="px-4 py-2 text-left border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {saleData.map((sale, index) => (
            <tr key={sale.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{sale.invoice_no}</td>
              <td className="px-4 py-2 border-b">{sale.invoice_date}</td>
              <td className="px-4 py-2 border-b">{sale.customer.name}</td>
              <td className="px-4 py-2 border-b">
                ₹ {sale.total_amount.toFixed(2)}
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleViewClick(sale.id)}
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

export default SaleList;
