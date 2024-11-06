import React from 'react';

const ItemRow = ({ item, index }) => {
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
                    'No image available'
                )}
            </td>
            <td className="py-2 px-4 border-b">
                <a href={`/edit-item/${item.id}`} className="btn bg-blue-500 text-white rounded p-1">Edit</a>
                <a href={`/delete-item/${item.id}`} className="btn bg-red-500 text-white rounded p-1 ml-2">Delete</a>
            </td>
        </tr>
    );
};

export default ItemRow;
