import axios from 'axios'
import type { Car, Part, Color, Livery, ApiResponse, DetectedCar } from '../types'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Car endpoints
export const carService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Car[]>>('/cars')
    return response.data.data || []
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Car>>(`/cars/${id}`)
    return response.data.data
  },
}

// Parts endpoints
export const partService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Part[]>>('/parts')
    return response.data.data || []
  },

  getByCategory: async (category: string) => {
    const response = await api.get<ApiResponse<Part[]>>(`/parts?category=${category}`)
    return response.data.data || []
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Part>>(`/parts/${id}`)
    return response.data.data
  },
}

// Color endpoints
export const colorService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Color[]>>('/colors')
    return response.data.data || []
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Color>>(`/colors/${id}`)
    return response.data.data
  },
}

// Livery endpoints
export const liveryService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Livery[]>>('/liveries')
    return response.data.data || []
  },

  getByCar: async (carId: string) => {
    const response = await api.get<ApiResponse<Livery[]>>(`/liveries?car=${carId}`)
    return response.data.data || []
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Livery>>(`/liveries/${id}`)
    return response.data.data
  },
}

// AI Detection endpoint
export const detectionService = {
  detectCar: async (imageFile: File) => {
    const formData = new FormData()
    formData.append('file', imageFile)

    const response = await api.post<ApiResponse<DetectedCar>>('/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },
}

// Export endpoint
export const exportService = {
  exportImage: async (customizationData: any) => {
    const response = await api.post(
      '/export/image',
      customizationData,
      { responseType: 'blob' }
    )
    return response.data
  },

  getShoppingList: async (customizationData: any) => {
    const response = await api.post<ApiResponse<any>>('/export/shopping-list', customizationData)
    return response.data.data
  },
}

export default api
