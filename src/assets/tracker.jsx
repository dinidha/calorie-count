import React, { useState, useEffect } from "react";

const FetchCurrentDateData = () => {
  const [data, setData] = useState([]); // State to store the fetched data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  const API_URL = "https://calorie-count-api.dinidha.workers.dev/api/data";
  const API_KEY = "f294a31a7ba443aeba5bbd623afd88cf"; // Replace with your actual API key

  // Get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch data for the current date
  const fetchCurrentDateData = async () => {
    const currentDate = getCurrentDate();
    try {
      const response = await fetch(`${API_URL}?date=${currentDate}`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result); // Set the fetched data
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again."); // Set error message
      setLoading(false); // Set loading to false
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchCurrentDateData();
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
      <h1>Calorie Entries for {getCurrentDate()}</h1>
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
        <div>No data found for today.</div>
      )}
    </div>
  );
};

export default FetchCurrentDateData;