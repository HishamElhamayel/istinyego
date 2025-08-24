import axios from "axios";

export const baseURL = "http://172.17.0.153:8989";

const client = axios.create({ baseURL });

export default client;
