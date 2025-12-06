import React, { useEffect } from 'react'
import axios from "axios";
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
})

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    // JWT 
    useEffect(() => {
        // Request Interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use(config => {
            const token = user?.accessToken;
            if (token) {
                config.headers.authorization = `Bearer ${token}`
            }
            return config;
        })

        // Response Interceptor
        // যদি কোন user তার email ছাড়া অন্য কোন email এর তথ্য দেখতে চাইবে তখন তাকে logout করে দিয়ে login /register page এ নিয়ে যাবে 
        const responseInterceptor = axiosSecure.interceptors.response.use(res => {
            return res;
        },
            err => {
                console.log(err)
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    logOut()
                        .then(() => {
                            navigate("/login")
                        })
                }

                return Promise.reject(err)

            })
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor)
            axiosSecure.interceptors.response.eject(responseInterceptor)
        }
    }, [user, logOut, navigate])

    return axiosSecure;
}

export default useAxiosSecure
