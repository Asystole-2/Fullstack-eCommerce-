import axios from "axios";

const API = axios.create({ URL: 'http://localhost:4000'})

export class AdminAPI {
    static async adminLogin(credentials) {
        return API.post('/admin/login', credentials);
    }

    static async getAdminDashboard(token) {
        return API.get('/admin/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}