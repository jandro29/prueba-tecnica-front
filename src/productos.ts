import axios, { type AxiosResponse } from "axios";

// URL base del backend Laravel
const API_URL = "http://127.0.0.1:8000/api/productos";

// Funciones obtenidas del BackEnd LARAVEL
export const getProductos = (): Promise<AxiosResponse> => axios.get(API_URL);
export const getProducto = (id: number): Promise<AxiosResponse> => axios.get(`${API_URL}/${id}`);
export const createProducto = (data: any): Promise<AxiosResponse> => axios.post(API_URL, data);
export const updateProducto = (id: number, data: any): Promise<AxiosResponse> => axios.put(`${API_URL}/${id}`, data);
export const deleteProducto = (id: number): Promise<AxiosResponse> => axios.delete(`${API_URL}/${id}`);