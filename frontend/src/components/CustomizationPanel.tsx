import React, { useEffect, useState } from 'react'
import type { Part, Color, Livery, Car } from '../types'
import { partService, colorService, liveryService, carService } from '../services/api'
import './CustomizationPanel.css'

interface CustomizationPanelProps {
  selectedCar: string | null
  onColorChange: (color: string) => void
  onKitChange: (kitId: string) => void
  onWheelsChange: (wheelId: string) => void
  onLiveryChange: (liveryId: string | null) => void
  currentCustomization: {
    bodyKit: string | null
    wheels: string | null
    primaryColor: string
    livery: string | null
  }
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  selectedCar,
  onColorChange,
  onKitChange,
  onWheelsChange,
  onLiveryChange,
  currentCustomization,
}) => {
  const [parts, setParts] = useState<Part[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [liveries, setLiveries] = useState<Livery[]>([])
  const [car, setCar] = useState<Car | null>(null)
  const [activeTab, setActiveTab] = useState<'kit' | 'wheels' | 'color' | 'livery'>('kit')

  // Load car data
  useEffect(() => {
    if (!selectedCar) return
    carService.getById(selectedCar).then(setCar)
  }, [selectedCar])

  // Load parts and compatible ones
  useEffect(() => {
    if (!car) return
    partService.getAll().then((allParts) => {
      const compatible = allParts.filter(
        (part) =>
          part.compatibility.includes(car.id) &&
          (part.category === 'body_kit' || part.category === 'wheels')
      )
      setParts(compatible)
    })
  }, [car])

  // Load colors
  useEffect(() => {
    colorService.getAll().then(setColors)
  }, [])

  // Load liveries
  useEffect(() => {
    if (!car) return
    liveryService.getAll().then((allLiveries) => {
      const compatible = allLiveries.filter((livery) => livery.compatibleCars.includes(car.id))
      setLiveries(compatible)
    })
  }, [car])

  const kits = parts.filter((p) => p.category === 'body_kit')
  const wheels = parts.filter((p) => p.category === 'wheels')

  return (
    <div className="customization-panel">
      <h2>Customization</h2>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'kit' ? 'active' : ''}`}
          onClick={() => setActiveTab('kit')}
        >
          Body Kits
        </button>
        <button
          className={`tab-button ${activeTab === 'wheels' ? 'active' : ''}`}
          onClick={() => setActiveTab('wheels')}
        >
          Wheels
        </button>
        <button
          className={`tab-button ${activeTab === 'color' ? 'active' : ''}`}
          onClick={() => setActiveTab('color')}
        >
          Colors
        </button>
        <button
          className={`tab-button ${activeTab === 'livery' ? 'active' : ''}`}
          onClick={() => setActiveTab('livery')}
        >
          Liveries
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'kit' && (
          <div className="kit-list">
            <div
              className={`kit-option ${!currentCustomization.bodyKit ? 'active' : ''}`}
              onClick={() => onKitChange('none')}
            >
              <div className="option-title">Stock</div>
              <div className="option-price">Base</div>
            </div>
            {kits.map((kit) => (
              <div
                key={kit.id}
                className={`kit-option ${currentCustomization.bodyKit === kit.id ? 'active' : ''}`}
                onClick={() => onKitChange(kit.id)}
              >
                <div className="option-title">{kit.name}</div>
                <div className="option-description">{kit.description}</div>
                <div className="option-price">${kit.price}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wheels' && (
          <div className="wheels-list">
            <div
              className={`wheel-option ${!currentCustomization.wheels ? 'active' : ''}`}
              onClick={() => onWheelsChange('none')}
            >
              <div className="option-title">Stock Wheels</div>
              <div className="option-price">Base</div>
            </div>
            {wheels.map((wheel) => (
              <div
                key={wheel.id}
                className={`wheel-option ${currentCustomization.wheels === wheel.id ? 'active' : ''}`}
                onClick={() => onWheelsChange(wheel.id)}
              >
                <div className="option-title">{wheel.name}</div>
                <div className="option-description">{wheel.description}</div>
                <div className="option-price">${wheel.price}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'color' && (
          <div className="color-grid">
            {colors.map((color) => (
              <div
                key={color.id}
                className={`color-option ${currentCustomization.primaryColor === color.hexCode ? 'active' : ''}`}
                onClick={() => onColorChange(color.hexCode)}
                title={color.name}
              >
                <div
                  className="color-swatch"
                  style={{
                    backgroundColor: color.hexCode,
                    opacity: color.metallic ? 0.8 : 1,
                    boxShadow: color.metallic ? 'inset 0 0 10px rgba(255,255,255,0.3)' : 'none',
                  }}
                ></div>
                <div className="color-name">{color.name}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'livery' && (
          <div className="livery-list">
            <div
              className={`livery-option ${!currentCustomization.livery ? 'active' : ''}`}
              onClick={() => onLiveryChange(null)}
            >
              <div className="option-title">None</div>
            </div>
            {liveries.map((livery) => (
              <div
                key={livery.id}
                className={`livery-option ${currentCustomization.livery === livery.id ? 'active' : ''}`}
                onClick={() => onLiveryChange(livery.id)}
              >
                <div className="option-title">{livery.name}</div>
                <div className="option-description">{livery.type}</div>
                <div className="option-description">{livery.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomizationPanel
