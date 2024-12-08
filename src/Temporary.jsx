"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Temporary() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchPrompt();
  }, []);

  const fetchPrompt = async () => {
    try {
      const response = await fetch(
        "https://pharmacybali-medical-chatbot-937077168251.asia-south1.run.app/v1/get_prompt"
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch the prompt.");
      }

      const data = await response.json();
      setPrompt(data.prompt || ""); // Assuming `data.prompt` contains the prompt text
    } catch (error) {
      setError(error.message);
      console.error("Error fetching prompt:", error.message);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(
        `https://pharmacybali-medical-chatbot-937077168251.asia-south1.run.app/v1/save_prompt?prompt=${encodeURIComponent(
          prompt
        )}`
      );

      const { msg } = response.data;
      setSuccessMessage(msg || "Prompt saved successfully!");

      // Set a timer to clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      console.log("Prompt saved successfully:", response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred while saving the prompt.";
      setError(errorMessage);
      console.error("Error saving prompt:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Prompt</h2>
        </div>
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>
          )}
          {successMessage && (
            <div className="p-2 text-green-600 bg-green-100 rounded">
              {successMessage}
            </div>
          )}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-96 p-2 border border-gray-300 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your prompt here..."
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Prompt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
