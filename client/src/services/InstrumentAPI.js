const BASE_URL = "http://localhost:4000/instruments";

export default class InstrumentAPI {
    static async updateStock(id, amount, action) {
        console.log(`Updating ${action} stock for ID:`, id); // Debugging

        const endpoint = `${BASE_URL}/${id}/${action}`;

        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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