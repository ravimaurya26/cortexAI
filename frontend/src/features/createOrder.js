import api from "../../utils/axios";

export const createOrder = async (plan) => {
    try {

        const { data } = await api.post("/api/billing/create", {
            plan
        });

        console.log("Order created successfully:", data);

        return data;

    } catch (error) {
        console.error("Create Order Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        throw error;
    }
};