import axios from "axios";

export const baseURL = "http://192.168.1.101:8989";

const client = axios.create({ baseURL });

export default client;
