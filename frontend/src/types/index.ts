// Car types
export interface Car {
  id: string
  make: string
  model: string
  year: number
  trim: string
  modelPath: string
  baseColor: string
  compatibleKits: string[]
  compatibleWheels: string[]
  compatibleLiveries: string[]
}

// Parts types
export interface Part {
  id: string
  name: string
  category: string
  description: string
  price: number
  compatibility: string[]
  thumbnailUrl: string
  properties: Record<string, any>
}

// Color types
export interface Color {
  id: string
  name: string
  hexCode: string
  metallic: boolean
  category: string
  specialEffect?: string
}

// Livery types
export interface Livery {
  id: string
  name: string
  type: 'paint' | 'wrap'
  description: string
  primaryColor: string
  secondaryColor: string | null
  compatibleCars: string[]
  textureUrl: string
  pattern?: string
}

// Customization state
export interface Customization {
  carId: string
  bodyKit: string | null
  wheels: string | null
  primaryColor: string
  secondaryColor: string | null
  livery: string | null
  wheels_color?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface DetectedCar {
  carId: string
  confidence: number
  make: string
  model: string
  year: number
}
