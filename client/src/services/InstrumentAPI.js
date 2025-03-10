const url = "http://localhost:4000/instruments"; // Ensure API path includes `/api`

export default class InstrumentAPI {
    static async updateStock(id, amount, action) {
        console.log(`Updating ${action} stock for ID:`, id); // Debugging

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("User is not logged in");
            throw new Error("Authorization required. Please log in.");
        }

        const endpoint = `${url}/${id}/${action}`;

        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // Attach JWT token
                },
                body: JSON.stringify({ amount })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            return await response.json();
        } catch (error) {
            console.error("Stock Update Error:", error.message);
            throw error;
        }
    }
}