import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/v1/customers';
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


async function delete_customer(params) {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/${params.id}`);
        return response.data;
    } catch (error) {
        console.error(`Error in DELETE request to ${BASE_URL}:`, error);
        throw error;
    }
}

export { delete_customer };
