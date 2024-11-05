import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const DetailedList = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [item, setItem] = useState("All");
  const [type, setType] = useState("Purchase");

  // Sample data array - replace with actual data later
  const data = []; // Empty data to match the "No Items Available" message

  const handleSearch = () => {
    // Add search functionality here in the future
    console.log("Search clicked");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Detailed List :</h2>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {/* From Date */}
        <div className="flex items-center">
          <label className="mr-2">From Date:</label>
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-md outline-none"
            />
            <FaCalendarAlt className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* To Date */}
        <div className="flex items-center">
          <label className="mr-2">To Date:</label>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-md outline-none"
            />
            <FaCalendarAlt className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Item Dropdown */}
        <div className="flex items-center">
          <label className="mr-2">Item:</label>
          <select
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="border border-gray-300 p-2 rounded-md outline-none"
          >
            <option>All</option>
            <option>Item 1</option>
            <option>Item 2</option>
            {/* Add more items as needed */}
          </select>
        </div>

        {/* Type Dropdown */}
        <div className="flex items-center">
          <label className="mr-2">Select Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 p-2 rounded-md outline-none"
          >
            <option>Purchase</option>
            <option>Sale</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 border">S.No.</th>
              <th className="py-3 px-4 border">Item Name</th>
              <th className="py-3 px-4 border">Item Price</th>
              <th className="py-3 px-4 border">Quantity</th>
              <th className="py-3 px-4 border">Total Price</th>
              <th className="py-3 px-4 border">Date</th>
              <th className="py-3 px-4 border">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="even:bg-gray-100 hover:bg-gray-200">
                  <td className="py-3 px-4 border">{index + 1}</td>
                  <td className="py-3 px-4 border">{item.name}</td>
                  <td className="py-3 px-4 border">{item.price}</td>
                  <td className="py-3 px-4 border">{item.quantity}</td>
                  <td className="py-3 px-4 border">{item.totalPrice}</td>
                  <td className="py-3 px-4 border">{item.date}</td>
                  <td className="py-3 px-4 border">{item.supplier}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-3 px-4 border text-gray-500">
                  No Items Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedList;
