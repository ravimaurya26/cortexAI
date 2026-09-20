import api from "../../utils/axios";
import {useDispatch} from "react-redux";

const getCurrentUser = async () => {
    try {   
        const { data } = await api.get("/api/me");
        return data; // Return the user data
    } catch (error) {
        return null; // Return null if there's an error (e.g., user not authenticated)
      
    }
};
 
export default getCurrentUser;