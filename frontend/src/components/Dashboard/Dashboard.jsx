import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  useEffect(() => {
    // Fetch the item dashboard data from the backend API
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/items_master/item-dashboard/');
        if (response.ok) {
          const data = await response.json();
          setActiveCount(data.item_active);  // Set the active item count
          setInactiveCount(data.item_inactive);  // Set the inactive item count
        } else {
          console.error('Failed to fetch item dashboard data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching item dashboard data:', error);
      }
    };

    fetchDashboardData(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="flex justify-center gap-8">
        <div className="w-40 h-40 bg-green-100 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-green-600">Active Items</h2>
          <p className="text-3xl font-bold text-green-800">{activeCount}</p>
        </div>
        <div className="w-40 h-40 bg-red-100 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-red-600">Inactive Items</h2>
          <p className="text-3xl font-bold text-red-800">{inactiveCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
