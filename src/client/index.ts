/**
 * creates a client for making HTTP requests with backend
 */

import createClient from 'openapi-fetch'
import type { paths } from "./api";


const BASE_URL = "https://33db9.yeg.rac.sh/";

export const createClientWithToken = (token: string | null) => createClient<paths>({
    baseUrl: BASE_URL,
    headers: {
        Authorization: token ? `Bearer ${token}` : "",
    },
    });

