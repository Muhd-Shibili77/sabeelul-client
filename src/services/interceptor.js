import axios from "axios";

export const refreshToken = async ()=>{
    try {
        const refreshAxios = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        const response = await refreshAxios.post("/auth/refresh-token", {}, { withCredentials: true });
        return response.data.accessToken;
    } catch (error) {
        console.error("Refresh token request failed", error);
        return null;
    }
}

export const setupInterceptor = (api)=>{
    api.interceptors.request.use(
        (config)=>{
            const token = localStorage.getItem('token')
            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error)=>{
            console.error("Axios request interceptor error", error);
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response)=>response,

        async(error)=>{
            const originalRequest = error.config

            if(originalRequest && error.response.status === 401 && originalRequest.url !== '/auth/refresh-token'){
                try {
                    console.log('your token is expired! attempting to refresh it')
                    const newAccessToken = await refreshToken();

                    if(newAccessToken){
                        localStorage.setItem('token',newAccessToken)
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return api(originalRequest)
                    }
                    
                } catch (error) {
                    console.error("Token refresh failed, logging out...", error);
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }
            }


            if(error.response.status === 403 && error.response.data.message === 'Access denied. Your account has been blocked.'){
                alert("Your account has been blocked. Please contact support.");
                    localStorage.removeItem("token"); 
                    window.location.href = "/"; 
            }
            return Promise.reject(error);
        }
    );
};