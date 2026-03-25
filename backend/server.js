import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// File upload config
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only images are allowed'))
    }
  },
})

// Load data files
const loadData = (filename) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename)
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error loading ${filename}:`, error)
    return []
  }
}

const cars = loadData('cars.json')
const parts = loadData('parts.json')
const colors = loadData('colors.json')
const liveries = loadData('liveries.json')

// Helper function for API responses
const sendResponse = (res, data, error = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: !error,
    data: error ? null : data,
    error: error,
  })
}

// ========== CAR ENDPOINTS ==========
app.get('/cars', (req, res) => {
  sendResponse(res, cars)
})

app.get('/cars/:id', (req, res) => {
  const car = cars.find((c) => c.id === req.params.id)
  if (car) {
    sendResponse(res, car)
  } else {
    sendResponse(res, null, 'Car not found', 404)
  }
})

// ========== PARTS ENDPOINTS ==========
app.get('/parts', (req, res) => {
  const { category } = req.query
  let filtered = parts

  if (category) {
    filtered = parts.filter((p) => p.category === category)
  }

  sendResponse(res, filtered)
})

app.get('/parts/:id', (req, res) => {
  const part = parts.find((p) => p.id === req.params.id)
  if (part) {
    sendResponse(res, part)
  } else {
    sendResponse(res, null, 'Part not found', 404)
  }
})

// ========== COLOR ENDPOINTS ==========
app.get('/colors', (req, res) => {
  sendResponse(res, colors)
})

app.get('/colors/:id', (req, res) => {
  const color = colors.find((c) => c.id === req.params.id)
  if (color) {
    sendResponse(res, color)
  } else {
    sendResponse(res, null, 'Color not found', 404)
  }
})

// ========== LIVERY ENDPOINTS ==========
app.get('/liveries', (req, res) => {
  const { car } = req.query
  let filtered = liveries

  if (car) {
    filtered = liveries.filter((l) => l.compatibleCars.includes(car))
  }

  sendResponse(res, filtered)
})

app.get('/liveries/:id', (req, res) => {
  const livery = liveries.find((l) => l.id === req.params.id)
  if (livery) {
    sendResponse(res, livery)
  } else {
    sendResponse(res, null, 'Livery not found', 404)
  }
})

// ========== AI DETECTION ENDPOINT ==========
app.post('/detect', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, null, 'No file uploaded', 400)
    }

    // In a real app, send to Python FastAPI service
    // For now, return a mock detection
    const mockDetections = [
      {
        carId: 'lamborghini_aventador_2012',
        confidence: 0.95,
        make: 'Lamborghini',
        model: 'Aventador',
        year: 2012,
      },
      {
        carId: 'nissan_skyline_r34',
        confidence: 0.88,
        make: 'Nissan',
        model: 'Skyline GT-R',
        year: 1999,
      },
      {
        carId: 'porsche_911_997',
        confidence: 0.82,
        make: 'Porsche',
        model: '911',
        year: 2009,
      },
    ]

    // Return the best match
    const detected = mockDetections[Math.floor(Math.random() * mockDetections.length)]
    
    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err)
    })

    sendResponse(res, detected)
  } catch (error) {
    sendResponse(res, null, error.message, 500)
  }
})

// ========== EXPORT ENDPOINTS ==========
app.post('/export/shopping-list', (req, res) => {
  try {
    const { carId, bodyKit, wheels } = req.body

    const selectedParts = parts.filter(
      (p) => (bodyKit && p.id === bodyKit) || (wheels && p.id === wheels)
    )

    const totalPrice = selectedParts.reduce((sum, p) => sum + p.price, 0)

    const shoppingList = {
      car: cars.find((c) => c.id === carId),
      parts: selectedParts,
      totalPrice,
      timestamp: new Date().toISOString(),
    }

    sendResponse(res, shoppingList)
  } catch (error) {
    sendResponse(res, null, error.message, 500)
  }
})

app.post('/export/image', async (req, res) => {
  try {
    // In a real app, this would generate an actual image
    // For now, send a placeholder response
    res.json({
      success: true,
      message: 'Export feature will use screenshot functionality',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    sendResponse(res, null, error.message, 500)
  }
})

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  sendResponse(res, { status: 'OK', timestamp: new Date().toISOString() })
})

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
  console.error('Error:', err)
  sendResponse(res, null, err.message, 500)
})

app.use((req, res) => {
  sendResponse(res, null, 'Route not found', 404)
})

// Start server
app.listen(PORT, () => {
  console.log(`✓ Backend server running at http://localhost:${PORT}`)
  console.log(`✓ API endpoints ready`)
  console.log(`✓ Health check: http://localhost:${PORT}/health`)
})
