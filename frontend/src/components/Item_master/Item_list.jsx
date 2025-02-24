import React, { useState, useEffect } from "react";
import ItemRow from "./ItemRow";

const ItemList = () => {
  const [items, setItems] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch items from your API endpoint
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8001/items_master/items/?search=${searchQuery}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data); 
          setItems(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch items:", response.status);
          setItems([]);  
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);  
      }
    };

    fetchItems();
  }, [searchQuery]); 

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);  
    setSearchQuery(e.target.search.value);
  };

  const handleDeleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Items List</h2>

      <form onSubmit={handleSearch} className="mb-4 flex justify-center">
        <div className="flex">
          <input
            type="text"
            name="search"
            className="form-input w-96 border border-gray-300 rounded-l-md p-2"
            placeholder="Search items..."
            value={searchQuery}  
            onChange={(e) => setSearchQuery(e.target.value)}  
          />
          <button
            className="btn bg-blue-500 text-white rounded-r-md p-2"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>

      <table className="min-w-full bg-white border border-gray-200 table-auto text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">S.No</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Brand</th>
            <th className="py-2 px-4 border-b">Unit Price</th>
            <th className="py-2 px-4 border-b">Images</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item, index) => (
              <ItemRow
                key={item.id}
                item={item}
                index={index}
                onDelete={handleDeleteItem}
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 0}
    className={`btn text-white rounded p-2 ${
      currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
    }`}
  >
    Prev
  </button>

  <span className="my-auto text-lg">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`btn text-white rounded p-2 ${
      currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
    }`}
  >
    Next
  </button>
       </div>


      {/* Add Item Button */}
      <div className="flex justify-center mt-4">
        <a
          href="/add-item"
          className="btn bg-green-500 text-white rounded p-2"
        >
          Add Item
        </a>
      </div>
    </div>
  );
};

export default ItemList;
