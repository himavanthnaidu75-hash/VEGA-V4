import api from '../api';
import config from './config';

const api = axios.create({
  baseURL: config.API_URL,
});

export default api;
