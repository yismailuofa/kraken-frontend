import createClient from 'openapi-fetch'
import type { paths } from "./api";


const BASE_URL = "http://162.246.157.194/";

export const createClientWithToken = (token: string | null) => createClient<paths>({
    baseUrl: BASE_URL,
    headers: {
        Authorization: token ? `Bearer ${token}` : "",
    },
    });

