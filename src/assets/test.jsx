import React, { useState, useEffect } from "react";
import axios from "axios";

const FetchAllData = () => {
  const [data, setData] = useState([]); // State to store the fetched data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  const API_URL = "https://calorie-count-api.dinidha.workers.dev/api/data";
  const API_KEY = "f294a31a7ba443aeba5bbd623afd88cf"; // Replace with your actual API key

  // Axios instance with API key in headers
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  // Fetch all data from the API
  const fetchAllData = async () => {
    try {
      const response = await api.get("/"); // Fetch all data
      setData(response.data); // Set the fetched data
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again."); // Set error message
      setLoading(false); // Set loading to false
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAllData();
  }, []);

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error state
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  // Display the data in a table
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>All Calorie Entries</h1>
      {data.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Entry ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Food Item</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Calories</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Meal Type</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Entry Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.EntryId}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.EntryId}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.FoodItem}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.Calories}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.MealType}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{entry.EntryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data found.</div>
      )}
    </div>
  );
};

export default FetchAllData;