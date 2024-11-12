import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios"; 

const DetailedList = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [item, setItem] = useState("All");
  const [type, setType] = useState("Purchase");
  const [data, setData] = useState([]); 
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  // Fetch items from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8001/items_master/items/"
        );
        setItems(response.data); 
      } catch (error) {
        console.error("Error fetching items:", error);
        setError("Error fetching items.");
      }
    };

    fetchItems();
  }, []);

  const handleSearch = async () => {
    setLoading(true); 
    setError(null); 

    try {
      const apiUrl = `http://127.0.0.1:8001/purchases/details_sale_purchase/?from_date=${fromDate}&to_date=${toDate}&type=${type.toLowerCase()}&item=${item}`;

      // Fetch the data from the API
      const response = await axios.get(apiUrl);

      // Set the response data to the state
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data.");
    } finally {
      setLoading(false); 
    }
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
              className="border border-gray-300 p-2 rounded-md outline-none pl-10"
            />
            <FaCalendarAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 z-10" />
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
              className="border border-gray-300 p-2 rounded-md outline-none pl-10"
            />
            <FaCalendarAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 z-10" />
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
            <option value="All">All</option>
            {items.map((item) => (
              <option key={item.id} value={item.item_name}>
                {item.item_name}
              </option>
            ))}
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
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

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
              <th className="py-3 px-4 border">
                {type === "Purchase" ? "Supplier" : "Customer"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="even:bg-gray-100 hover:bg-gray-200">
                  <td className="py-3 px-4 border">{index + 1}</td>
                  <td className="py-3 px-4 border">{item.item_name}</td>
                  <td className="py-3 px-4 border">{item.price}</td>
                  <td className="py-3 px-4 border">{item.quantity}</td>
                  {/* Conditionally show the total price depending on the type */}
                  <td className="py-3 px-4 border">
                    {type === "Purchase"
                      ? item.total_price.toFixed(2)
                      : item.amount}
                  </td>
                  <td className="py-3 px-4 border">
                    {new Date(item.datetime).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border">
                    {type === "Purchase"
                      ? item.supplier_name
                      : item.customer_name}
                  </td>
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
