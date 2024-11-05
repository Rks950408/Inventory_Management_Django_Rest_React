import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const ItemStockList = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Sample data - replace with actual data fetching logic
    const fetchedItems = [
      { id: 1, name: "PEN", totalPurchased: 60, totalSold: 3 },
      // Add more sample items here if needed
    ];
    setItems(fetchedItems);
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Item Stock List :</h2>

      <div className="flex items-center mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search by Item Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 outline-none w-64"
          />
          <button className="bg-blue-500 p-2 text-white">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 border">S.No.</th>
              <th className="py-3 px-4 border">Item Name</th>
              <th className="py-3 px-4 border">Total Purchased</th>
              <th className="py-3 px-4 border">Total Sold</th>
              <th className="py-3 px-4 border">Available Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
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
