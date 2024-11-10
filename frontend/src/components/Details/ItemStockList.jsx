import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const ItemStockList = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8001/purchases/stock-list/?search=${searchTerm}&item=${selectedItem}`
        );
        const data = await response.json();

        if (response.ok) {
          const fetchedItems = data.stock_data.map((item) => ({
            id: item[0],
            name: item[1],
            totalPurchased: item[3],
            totalSold: item[2],
          }));
          setItems(fetchedItems);
        } else {
          setError("Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchTerm, selectedItem]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleItemChange = (event) => setSelectedItem(event.target.value);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Item Stock List</h2>

      <div className="flex justify-between items-center mb-6 space-x-4">
        {/* Filter by Item Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="item" className="text-lg font-medium">
            Filter by Item:
          </label>
          <select
            id="item"
            name="item"
            value={selectedItem}
            onChange={handleItemChange}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="">All</option>
            {items.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Field */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search by Item Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 outline-none w-64 rounded-l-lg"
          />
          <button className="bg-blue-500 p-2 text-white rounded-r-lg">
            <FaSearch />
          </button>
        </div>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse shadow-lg rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 border">S.No.</th>
              <th className="py-3 px-4 border">Item Name</th>
              <th className="py-3 px-4 border">Total Purchased</th>
              <th className="py-3 px-4 border">Total Sold</th>
              <th className="py-3 px-4 border">Available Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className="even:bg-gray-100 hover:bg-gray-200"
                >
                  <td className="py-3 px-4 border">{index + 1}</td>
                  <td className="py-3 px-4 border">{item.name}</td>
                  <td className="py-3 px-4 border">{item.totalPurchased}</td>
                  <td className="py-3 px-4 border">{item.totalSold}</td>
                  <td className="py-3 px-4 border">
                    {item.totalPurchased - item.totalSold}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 border text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemStockList;
