import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/v1/customers';
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

async function save_update_customer(params) {
    const customer = {
        id: params.id,
        name: params.name,
        phoneNumber: params.phone_number,
        age: params.age,
        active: params.isActif
    }
    console.log(customer)
    try {
        let response;

        response = await axiosInstance.post(BASE_URL, customer);

        return JSON.stringify(response.data);
    } catch (error) {
        console.error(`Error in request to ${BASE_URL}:`, error);
        throw error;
    }
}
export { save_update_customer };