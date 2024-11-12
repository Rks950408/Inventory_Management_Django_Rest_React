import React, { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Import the modal component

const ItemRow = ({ item, index, onDelete }) => {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(false); // Loading state for API request

  const imageUrl = item.image ? `/media/${item.image}` : '/path/to/default-image.jpg'; // Default image fallback

  const handleDelete = async () => {
    try {
      setLoading(true); // Show loading state
      const response = await fetch(
        `http://127.0.0.1:8001/items_master/items/${item.id}/delete/`,
        {
          method: "PATCH", // Soft delete (mark as deleted)
        }
      );

      if (response.ok) {
        onDelete(item.id); // Notify parent to remove item from list
      } else {
        console.error("Failed to delete item:", response.status);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false); // Hide loading state after the request
      setShowModal(false); // Close the modal
    }
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-4 border-b">{index + 1}</td>
      <td className="py-2 px-4 border-b">{item.item_name}</td>
      <td className="py-2 px-4 border-b">{item.category}</td>
      <td className="py-2 px-4 border-b">{item.brand_name}</td>
      <td className="py-2 px-4 border-b">{item.unit_price}</td>
      <td className="py-2 px-4 border-b">
        {item.image ? (
          <img
            src={`http://127.0.0.1:8001/media/${item.image}`} // Corrected URL
            alt={item.item_name}
            className="w-24 h-auto"
          />
        ) : (
          "No image available"
        )}
      </td>
      <td className="py-2 px-4 border-b">
        <a
          href={`/edit-item/${item.id}`}
          className="btn bg-blue-500 text-white rounded p-1"
        >
          Edit
        </a>
        <button
          className="btn bg-red-500 text-white rounded p-1 ml-2"
          onClick={() => setShowModal(true)} // Open the modal
        >
          Delete
        </button>
      </td>

      {/* Conditional rendering of the modal */}
      {showModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowModal(false)} // Close the modal
          onConfirm={handleDelete} // Call handleDelete when confirmed
          itemName={item.item_name} // Pass item name to modal
        />
      )}
    </tr>
  );
};

export default ItemRow;
