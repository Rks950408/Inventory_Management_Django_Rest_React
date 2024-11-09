import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PurchaseDetails = () => {
  const { id } = useParams(); // Get the purchase ID from the URL
  const [purchaseDetails, setPurchaseDetails] = useState(null);

  useEffect(() => {
    // Fetch purchase details by id
    axios
      .get(`http://127.0.0.1:8001/purchases/purchases/${id}/`)
      .then((response) => {
        setPurchaseDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching purchase details:", error);
      });
  }, [id]);

  if (!purchaseDetails) return <div>Loading...</div>;

  const { supplier, invoice_no, invoice_date, total_amount, purchase_details } =
    purchaseDetails;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Purchase Details for Invoice: {invoice_no}
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Supplier Details:</h2>
        <p>Name: {supplier.name}</p>
        <p>Phone No: {supplier.contact}</p>
        <p>Address: {supplier.address}</p>
      </div>

      <div className="mb-6">
        <p>
          <strong>Invoice Date:</strong> {invoice_date}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹ {total_amount}
        </p>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-blue-200">
            <th className="px-4 py-2 text-left border-b">S.No.</th>
            <th className="px-4 py-2 text-left border-b">Item Name</th>
            <th className="px-4 py-2 text-left border-b">Price (₹)</th>
            <th className="px-4 py-2 text-left border-b">Quantity</th>
            <th className="px-4 py-2 text-left border-b">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {purchase_details.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{item.item_name}</td>
              <td className="px-4 py-2 border-b">₹ {item.price}</td>
              <td className="px-4 py-2 border-b">{item.quantity}</td>
              <td className="px-4 py-2 border-b">₹ {item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Back to Purchase List
        </button>
      </div>
    </div>
  );
};

export default PurchaseDetails;
