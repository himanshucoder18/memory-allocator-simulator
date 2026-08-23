import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const initMemory = (size) => API.post(`/init?size=${size}`);
export const allocateProcess = (data) => API.post('/allocate', data);
export const deallocateProcess = (processId) => API.post(`/deallocate?processId=${processId}`);
export const resetMemory = () => API.post('/reset');
export const defragmentMemory = () => API.post('/defragment');
export const getStatus = () => API.get('/status');