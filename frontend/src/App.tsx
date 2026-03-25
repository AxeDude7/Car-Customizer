import React, { useState } from 'react'
import Viewer3D from './components/Viewer3D'
import CustomizationPanel from './components/CustomizationPanel'
import CarDetection from './components/CarDetection'
import { useCarCustomization } from './hooks/useCarCustomization'
import { carService } from './services/api'
import type { DetectedCar, Car } from './types'
import './App.css'

function App() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [detectedCar, setDetectedCar] = useState<DetectedCar | null>(null)
  const [showDetection, setShowDetection] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const {
    customization,
    setCarId,
    setBodyKit,
    setWheels,
    setPrimaryColor,
    setSecondaryColor,
    setLivery,
    reset,
  } = useCarCustomization()

  const handleCarDetected = (detected: DetectedCar) => {
    setDetectedCar(detected)
  }

  const handleConfirmCar = async (carId: string) => {
    const car = await carService.getById(carId)
    if (car) {
      setSelectedCar(car)
      setCarId(carId)
      setShowDetection(false)
      // Reset customization for new car
      reset()
    }
  }

  const handleNewCar = () => {
    setShowDetection(true)
    setSelectedCar(null)
    setDetectedCar(null)
    reset()
  }

  const handleExport = async () => {
    if (!selectedCar) return
    setIsExporting(true)
    try {
      // Implement export functionality
      console.log('Exporting customization:', customization)
      // In a real app, this would download the image and parts list
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-content">
          <h1>🚗 Car Customizer</h1>
          <p className="tagline">Customize your dream car in real-time</p>
        </div>
        {selectedCar && (
          <div className="car-info">
            <h3>
              {selectedCar.make} {selectedCar.model} ({selectedCar.year})
            </h3>
            <button className="btn-new-car" onClick={handleNewCar}>
              New Car
            </button>
          </div>
        )}
      </div>

      <div className="app-content">
        {showDetection ? (
          <div className="detection-container">
            <CarDetection
              onCarDetected={handleCarDetected}
              onConfirm={handleConfirmCar}
              currentDetected={detectedCar}
            />
          </div>
        ) : (
          <>
            <div className="viewer-container">
              <Viewer3D
                modelPath={selectedCar?.modelPath}
                primaryColor={customization.primaryColor}
                secondaryColor={customization.secondaryColor}
              />
            </div>

            <div className="controls-container">
              <CustomizationPanel
                selectedCar={customization.carId}
                onColorChange={setPrimaryColor}
                onKitChange={setBodyKit}
                onWheelsChange={setWheels}
                onLiveryChange={setLivery}
                currentCustomization={customization}
              />
            </div>
          </>
        )}
      </div>

      {selectedCar && !showDetection && (
        <div className="app-footer">
          <div className="customization-summary">
            <div className="summary-item">
              <span className="label">Kit:</span>
              <span className="value">{customization.bodyKit || 'Stock'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Wheels:</span>
              <span className="value">{customization.wheels || 'Stock'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Color:</span>
              <div className="color-preview" style={{ backgroundColor: customization.primaryColor }}></div>
            </div>
            <div className="summary-item">
              <span className="label">Livery:</span>
              <span className="value">{customization.livery || 'None'}</span>
            </div>
          </div>

          <button
            className="btn-export"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : '📥 Save & Export'}
          </button>
        </div>
      )}
    </div>
  )
}

export default App
