import React, { useState, useRef } from 'react'
import { detectionService } from '../services/api'
import type { DetectedCar } from '../types'
import './CarDetection.css'

interface CarDetectionProps {
  onCarDetected: (detectedCar: DetectedCar) => void
  onConfirm: (carId: string) => void
  currentDetected: DetectedCar | null
}

const CarDetection: React.FC<CarDetectionProps> = ({
  onCarDetected,
  onConfirm,
  currentDetected,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Show preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Send to API
      const detectedCar = await detectionService.detectCar(file)
      if (detectedCar) {
        onCarDetected(detectedCar)
        setShowConfirmation(true)
      } else {
        setError('Failed to detect car. Please try another image.')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to detect car. Please try another image.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    if (currentDetected) {
      onConfirm(currentDetected.carId)
      setShowConfirmation(false)
      setPreviewUrl(null)
    }
  }

  const handleRetry = () => {
    setShowConfirmation(false)
    setPreviewUrl(null)
    setError(null)
    fileInputRef.current?.click()
  }

  return (
    <div className="car-detection">
      <div className="detection-header">
        <h3>Upload Car Photo</h3>
        <p className="description">Upload a photo of any car to get started</p>
      </div>

      {!previewUrl ? (
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          <div className="upload-icon">📷</div>
          <h4>Click to upload or drag images here</h4>
          <p>Supports JPG, PNG, GIF up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="preview-section">
          <img src={previewUrl} alt="Car preview" className="preview-image" />
          {isLoading && <div className="detection-loading">Detecting car...</div>}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {showConfirmation && currentDetected && (
        <div className="confirmation-dialog">
          <h4>Car Detected</h4>
          <div className="detection-info">
            <p>
              <strong>Make & Model:</strong> {currentDetected.make} {currentDetected.model}
            </p>
            <p>
              <strong>Year:</strong> {currentDetected.year}
            </p>
            <p>
              <strong>Confidence:</strong> {(currentDetected.confidence * 100).toFixed(1)}%
            </p>
          </div>
          <div className="confirmation-buttons">
            <button className="btn-confirm" onClick={handleConfirm}>
              ✓ Confirm
            </button>
            <button className="btn-retry" onClick={handleRetry}>
              ↻ Retry
            </button>
          </div>
        </div>
      )}

      {!previewUrl && !showConfirmation && (
        <div className="button-group">
          <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
            Choose File
          </button>
        </div>
      )}
    </div>
  )
}

export default CarDetection
