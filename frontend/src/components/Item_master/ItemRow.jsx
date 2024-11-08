import React from "react";

const ItemRow = ({ item, index, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8001/items_master/items/${item.id}/delete/`,
        {
          method: "PATCH", // Soft delete (mark as deleted)
        }
      );

      if (response.ok) {
        onDelete(item.id); // Notify the parent component to remove the item from the list
      } else {
        console.error("Failed to delete item:", response.status);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-4 border-b">{index + 1}</td>
      <td className="py-2 px-4 border-b">{item.item_name}</td>
      <td className="py-2 px-4 border-b">{item.category}</td>
      <td className="py-2 px-4 border-b">{item.brand}</td>
      <td className="py-2 px-4 border-b">{item.unit_price}</td>
      <td className="py-2 px-4 border-b">
        {item.image ? (
          <img src={item.image} alt={item.item_name} className="w-24 h-auto" />
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
          onClick={handleDelete}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ItemRow;
