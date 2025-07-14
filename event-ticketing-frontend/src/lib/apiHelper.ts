import axios from "axios"

export const BASE_URL_BACKEND: string = "http://localhost:3077"

export const apiBackend = axios.create({
    baseURL: BASE_URL_BACKEND
})