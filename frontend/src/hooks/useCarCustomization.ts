import { useState, useCallback } from 'react'
import type { Customization } from '../types'

const initialCustomization: Customization = {
  carId: '',
  bodyKit: null,
  wheels: null,
  primaryColor: '#0A0E27',
  secondaryColor: null,
  livery: null,
  wheels_color: '#808080',
}

export const useCarCustomization = () => {
  const [customization, setCustomization] = useState<Customization>(initialCustomization)

  const setCarId = useCallback((carId: string) => {
    setCustomization((prev) => ({
      ...prev,
      carId,
      bodyKit: null,
      wheels: null,
      livery: null,
    }))
  }, [])

  const setBodyKit = useCallback((kitId: string) => {
    setCustomization((prev) => ({
      ...prev,
      bodyKit: kitId === prev.bodyKit ? null : kitId,
    }))
  }, [])

  const setWheels = useCallback((wheelId: string) => {
    setCustomization((prev) => ({
      ...prev,
      wheels: wheelId === prev.wheels ? null : wheelId,
    }))
  }, [])

  const setPrimaryColor = useCallback((color: string) => {
    setCustomization((prev) => ({
      ...prev,
      primaryColor: color,
    }))
  }, [])

  const setSecondaryColor = useCallback((color: string | null) => {
    setCustomization((prev) => ({
      ...prev,
      secondaryColor: color,
    }))
  }, [])

  const setLivery = useCallback((liveryId: string | null) => {
    setCustomization((prev) => ({
      ...prev,
      livery: liveryId === prev.livery ? null : liveryId,
    }))
  }, [])

  const setWheelsColor = useCallback((color: string) => {
    setCustomization((prev) => ({
      ...prev,
      wheels_color: color,
    }))
  }, [])

  const reset = useCallback(() => {
    setCustomization(initialCustomization)
  }, [])

  return {
    customization,
    setCarId,
    setBodyKit,
    setWheels,
    setPrimaryColor,
    setSecondaryColor,
    setLivery,
    setWheelsColor,
    reset,
  }
}
