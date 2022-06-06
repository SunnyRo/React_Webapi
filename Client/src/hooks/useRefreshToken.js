import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        var tokenObject = {
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
        };
        const response = await axios.post("/Token/refresh", tokenObject);
        setAuth((prev) => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken };
        });
        return response.data.accessToken;
    };
    return refresh;
};

export default useRefreshToken;
