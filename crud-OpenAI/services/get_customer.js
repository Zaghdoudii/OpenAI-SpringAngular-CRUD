import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/v1/customers';
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

async function get_customer(params) {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${params.id}`);
        return JSON.stringify(response.data);
    } catch (error) {
        console.error(`Error in GET request to ${BASE_URL}:`, error);
        throw error;
    }
}
export { get_customer };