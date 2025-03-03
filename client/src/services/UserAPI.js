const url = "http://localhost:4000/users"

export default class UserAPI {
    static async getUsers() {
        try {
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error("Failed to fetch users")
            }
            return await response.json();
        }catch (error) {
            console.error("Fetch Users Error:", error.message);
            return [];
        }
    }
}