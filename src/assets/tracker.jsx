import React, { useState, useEffect } from "react";

const CalorieTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [calorieData, setCalorieData] = useState(null);
  const [allData, setAllData] = useState([]); // State to store all data

  const API_URL = "https://calorie-count-api.dinidha.workers.dev/api/data";
  const API_KEY = "f294a31a7ba443aeba5bbd623afd88cf"; // Replace with your actual API key

  // Fetch data for the selected date
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}?date=${selectedDate}`, {
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Log the response
      setCalorieData(data);
      if (data) {
        setBreakfast(data.breakfast || "");
        setLunch(data.lunch || "");
        setDinner(data.dinner || "");
        setSnacks(data.snacks ? data.snacks.split(",").map(Number) : []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Save data to the API
  const saveData = async () => {
    const data = {
      date: selectedDate,
      breakfast: parseInt(breakfast),
      lunch: parseInt(lunch),
      dinner: parseInt(dinner),
      snacks: snacks.join(","),
    };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      fetchData(); // Refresh data after saving
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Fetch all data from the API
  const fetchAllData = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("All Data:", data); // Log all data
      setAllData(data); // Store all data in state
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Add a new snack input
  const addSnack = () => {
    setSnacks([...snacks, 0]);
  };

  // Update a snack's value
  const updateSnack = (index, value) => {
    const newSnacks = [...snacks];
    newSnacks[index] = parseInt(value) || 0;
    setSnacks(newSnacks);
  };

  // Remove a snack
  const removeSnack = (index) => {
    const newSnacks = snacks.filter((_, i) => i !== index);
    setSnacks(newSnacks);
  };

  // Calculate total calories and remaining calories
  const totalCalories =
    (parseInt(breakfast) || 0) +
    (parseInt(lunch) || 0) +
    (parseInt(dinner) || 0) +
    snacks.reduce((sum, snack) => sum + (snack || 0), 0);
  const remainingCalories = 1438 - totalCalories;

  // Automatically save data when inputs change
  useEffect(() => {
    saveData();
  }, [breakfast, lunch, dinner, snacks]);

  // Fetch data when the selected date changes
  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Daily Calorie Tracker</h1>
      <p>Track your calories for breakfast, lunch, dinner, and snacks. Daily goal: 1438 kcal.</p>

      <div>
        <label>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>Breakfast: </label>
        <input
          type="number"
          value={breakfast}
          onChange={handleInputChange(setBreakfast)}
          required
        /> kcal
      </div>

      <div>
        <label>Lunch: </label>
        <input
          type="number"
          value={lunch}
          onChange={handleInputChange(setLunch)}
          required
        /> kcal
      </div>

      <div>
        <label>Dinner: </label>
        <input
          type="number"
          value={dinner}
          onChange={handleInputChange(setDinner)}
          required
        /> kcal
      </div>

      <div>
        <h3>Snacks</h3>
        {snacks.map((snack, index) => (
          <div key={index}>
            <label>Snack {index + 1}: </label>
            <input
              type="number"
              value={snack}
              onChange={(e) => updateSnack(index, e.target.value)}
            /> kcal
            <button onClick={() => removeSnack(index)}>Remove</button>
          </div>
        ))}
        <button onClick={addSnack}>Add Snack</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Summary for {selectedDate}</h2>
        <p>Breakfast: {breakfast || 0} kcal</p>
        <p>Lunch: {lunch || 0} kcal</p>
        <p>Dinner: {dinner || 0} kcal</p>
        <p>Snacks: {snacks.join(", ") || "None"}</p>
        <p>Total Consumed: {totalCalories} kcal</p>
        <p>
          Remaining: {remainingCalories} kcal{" "}
          {remainingCalories < 0 && `(Exceeded by ${-remainingCalories} kcal)`}
        </p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>All Data</h2>
        <ul>
          {allData.map((entry, index) => (
            <li key={index}>
              <p>Date: {entry.date}</p>
              <p>Breakfast: {entry.breakfast} kcal</p>
              <p>Lunch: {entry.lunch} kcal</p>
              <p>Dinner: {entry.dinner} kcal</p>
              <p>Snacks: {entry.snacks}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalorieTracker;