import axios from 'axios';

// Dynamically picks up your Vercel Environment Variable, falling back to localhost during local tests
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const API = axios.create({
    baseURL: `${BASE_URL}/api`
});

export const getStudents = () => API.get('/students');
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
