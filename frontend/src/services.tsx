import axios from "axios";
import { useState } from "react";

/**
 *
 * @param method
 * @param endpoint
 * @param data
 * @returns Promise<any>
 */

export async function privateQuery(method: string, endpoint: string, data: any) {
    const token = localStorage.getItem("token");
    const res = await axios({
        method: method,
        url: process.env["REACT_APP_LOCAL_API_URL"] + endpoint,
        data: data,
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

// Function to manage token as a state
export function useToken() {
    const getToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            return token;
        } else {
            return "";
        }
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: string) => {
        localStorage.setItem("token", userToken);
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token,
    };
}

interface credentials {
    password: string;
}

/**
 *
 * @param credentials
 * @returns User token.
 */
export async function loginUser(credentials: credentials) {
    return fetch(`${process.env["REACT_APP_LOCAL_API_URL"]}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })
        .then((response) => {
            if (response.status === 200) {
                return response;
            } else if (response.status === 401) {
                throw new Error("Bad Credentials.");
            } else {
                throw new Error("Error from server.");
            }
        })
        .then((data) => data.json())
        .catch((reason) => {
            alert(reason);
            return { error: reason };
        });
}
