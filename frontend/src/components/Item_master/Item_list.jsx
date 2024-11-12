import React, { useState, useEffect } from "react";
import ItemRow from "./ItemRow";

const ItemList = () => {
  const [items, setItems] = useState([]); // Initialize as an empty array
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
          console.log("Fetched data:", data); // Log the fetched data for debugging
          // Ensure data is always an array
          setItems(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch items:", response.status);
          setItems([]);  // Set to empty array if the response is not ok
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);  // Set to empty array if error occurs
      }
    };

    fetchItems();
  }, [searchQuery]); // Runs the effect when the search query changes

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);  // Reset to the first page when a new search is made
    setSearchQuery(e.target.search.value);
  };

  const handleDeleteItem = (itemId) => {
    // Remove the deleted item from the state
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
            value={searchQuery}  // Make it controlled
            onChange={(e) => setSearchQuery(e.target.value)}  // Add onChange to update state
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
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn bg-gray-300 text-white rounded p-2 mr-2"
        >
          Prev
        </button>
        <span className="my-auto text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn bg-gray-300 text-white rounded p-2 ml-2"
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
