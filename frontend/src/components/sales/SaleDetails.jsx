import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SaleDetails = () => {
  const { id } = useParams();
  const [saleDetails, setSaleDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8001/purchases/sale-details/${id}/`)
      .then((response) => {
        setSaleDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });
  }, [id]);

  if (!saleDetails) return <div>Loading...</div>;

  const { customer, invoice_no, invoice_date, total_amount, sale_details } =
    saleDetails;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Sale Details for Invoice: {invoice_no}
      </h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Customer Details:</h2>
        <p>Name: {customer.name}</p>
        <p>Contact: {customer.contact}</p>
        <p>Address: {customer.address}</p>
      </div>
      <div className="mb-6">
        <p>
          <strong>Invoice Date:</strong> {invoice_date}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹ {total_amount.toFixed(2)}
        </p>
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-blue-200">
            <th className="px-4 py-2 text-left border-b">S.No.</th>
            <th className="px-4 py-2 text-left border-b">Item Name</th>
            <th className="px-4 py-2 text-left border-b">Brand</th>
            <th className="px-4 py-2 text-left border-b">Quantity</th>
            <th className="px-4 py-2 text-left border-b">Price (₹)</th>
            <th className="px-4 py-2 text-left border-b">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {sale_details.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{item.item_name}</td>
              <td className="px-4 py-2 border-b">{item.brand_name}</td>
              <td className="px-4 py-2 border-b">{item.quantity}</td>
              <td className="px-4 py-2 border-b">₹ {item.price.toFixed(2)}</td>
              <td className="px-4 py-2 border-b">₹ {item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Back to Sale List
        </button>
      </div>
    </div>
  );
};

export default SaleDetails;
