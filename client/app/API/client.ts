import axios from "axios";

const baseURL = "http://192.168.1.7:8989";

const client = axios.create({ baseURL });

export default client;
