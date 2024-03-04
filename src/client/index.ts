import createClient from 'openapi-fetch'
import type { paths } from "./api";


const client = createClient<paths>({baseUrl: 'http://162.246.157.194/'})

export default client;
