// src/services/SKOfficialService.js

const API_URL = "http://localhost:5000/api/officials";

export const SKOfficialService = {
  // GET ALL OFFICIALS
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("API Error (getOfficials):", error);
      throw error;
    }
  },

  // ADD OFFICIAL
  create: async (data) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("API Error (createOfficial):", error);
      throw error;
    }
  },

  // UPDATE OFFICIAL
  update: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("API Error (updateOfficial):", error);
      throw error;
    }
  },

  // DELETE OFFICIAL
  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return true;
    } catch (error) {
      console.error("API Error (deleteOfficial):", error);
      throw error;
    }
  },
};
