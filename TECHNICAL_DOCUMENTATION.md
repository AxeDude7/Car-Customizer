# 🔧 Technical Documentation - Car Customizer

Comprehensive guide for developers to understand, extend, and maintain the Car Customizer application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Frontend Guide](#frontend-guide)
3. [Backend Guide](#backend-guide)
4. [AI Service Guide](#ai-service-guide)
5. [Data Management](#data-management)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Performance Optimization](#performance-optimization)
8. [Security Considerations](#security-considerations)

---

## Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite + TypeScript | Interactive UI & real-time visualization |
| **3D Rendering** | Three.js + WebGL | Real-time 3D car visualization |
| **Backend** | Express.js + Node.js | REST API & business logic |
| **AI Detection** | FastAPI + OpenCV + NumPy | Image processing & car detection |
| **Data Storage** | JSON files | Car catalog, parts, colors, liveries |
| **Build Tools** | Vite | Ultra-fast frontend build tool |

### Data Flow

```
User Upload Photo
       ↓
[Frontend] (Form submission)
       ↓
[Backend] POST /detect (receive file)
       ↓
[AI Service] (process image)
       ↓
Detection Result (make, model, year)
       ↓
[Frontend] Load car model & compatible parts
       ↓
[3D Viewer] Render and customize
       ↓
[Backend] Generate shopping list/export
```

---

## Frontend Guide

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── App.tsx              # Main application component
│   │   ├── Viewer3D.tsx         # Three.js 3D viewer wrapper
│   │   ├── CustomizationPanel.tsx # Parts & colors selector
│   │   └── CarDetection.tsx     # Upload & detection UI
│   ├── hooks/
│   │   └── useCarCustomization.ts # State management hook
│   ├── services/
│   │   └── api.ts              # API client & endpoints
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.css                 # Main styles
│   ├── index.css               # Global styles
│   └── main.tsx                # Entry point
├── public/
│   └── models/                 # 3D model files (.glb)
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

### Key Components

#### App.tsx
- **Purpose:** Main container managing application state and routing logic
- **State:** Selected car, customization state, detection results
- **Props:** None (root component)
- **Key Functions:**
  - `handleCarDetected()` - Process AI detection results
  - `handleConfirmCar()` - Load selected car model
  - `handleNewCar()` - Reset state for new car selection

#### Viewer3D.tsx
- **Purpose:** Three.js 3D scene rendering with car model visualization
- **Props:**
  - `modelPath` - Path to .glb model file
  - `primaryColor` - Hex color for car body
  - `secondaryColor` - Secondary color (optional)
  - `onLoadingChange` - Callback for loading state
- **Features:**
  - Auto-rotating camera with orbit controls
  - Dynamic lighting (ambient + directional + point)
  - Real-time color updates
  - Responsive canvas resizing
- **Performance Tips:**
  - Uses `useRef` to prevent re-initialization
  - Properly cleans up Three.js resources on unmount
  - Implements `requestAnimationFrame` throttling

#### CustomizationPanel.tsx
- **Purpose:** UI for selecting parts, colors, and liveries
- **Props:**
  - `selectedCar` - Current car ID
  - `onColorChange`, `onKitChange`, `onWheelsChange`, `onLiveryChange` - Callbacks
  - `currentCustomization` - Current state
- **State Management:**
  - Loads compatible parts/colors/liveries based on selected car
  - Filters data to show only compatible items
  - Manages tab state for different customization categories

#### CarDetection.tsx
- **Purpose:** File upload and car detection UI
- **Props:**
  - `onCarDetected` - Callback with detection results
  - `onConfirm` - Callback to confirm selection
  - `currentDetected` - Current detection result
- **Features:**
  - Drag-and-drop support ready (can be added)
  - Image preview
  - Confidence display
  - Retry mechanism

### State Management

Using custom hook `useCarCustomization`:

```typescript
const {
  customization,      // Current state object
  setCarId,          // Change car
  setBodyKit,        // Toggle body kit
  setWheels,         // Toggle wheels
  setPrimaryColor,   // Change primary color
  setSecondaryColor, // Change secondary color
  setLivery,         // Change livery
  setWheelsColor,    // Change wheel color
  reset,             // Reset to initial state
} = useCarCustomization()
```

### Adding New Features

#### Example: Add Suspension Type Option

1. **Update Type Definitions** (types/index.ts):
```typescript
interface Customization {
  // ... existing fields
  suspension?: string  // Add new field
}
```

2. **Update Hook** (hooks/useCarCustomization.ts):
```typescript
const setSuspension = useCallback((suspensionId: string) => {
  setCustomization((prev) => ({
    ...prev,
    suspension: suspensionId === prev.suspension ? null : suspensionId,
  }))
}, [])

return {
  // ... existing returns
  setSuspension,
}
```

3. **Add Suspension Tab** (CustomizationPanel.tsx):
```typescript
<button
  className={`tab-button ${activeTab === 'suspension' ? 'active' : ''}`}
  onClick={() => setActiveTab('suspension')}
>
  Suspension
</button>
```

4. **Add Data** (data/parts.json):
```json
{
  "id": "lowering_kit_air",
  "name": "Air Suspension Kit",
  "category": "suspension",
  // ... other fields
}
```

---

## Backend Guide

### Server Architecture

```javascript
Express App
├── Middleware
│   ├── CORS
│   ├── JSON parser
│   └── Static file server
├── API Routes
│   ├── /cars         - Car catalog
│   ├── /parts        - Parts & kits
│   ├── /colors       - Colors
│   ├── /liveries     - Paint schemes
│   ├── /detect       - AI detection
│   └── /export       - Export functions
└── Error Handler
    └── Global exception handling
```

### Core Endpoints

#### GET /cars
Returns all available cars.
```javascript
Response: { success: true, data: Car[], error: null }
```

#### POST /detect
Car detection from uploaded image.
```javascript
Request: multipart/form-data { file: File }
Response: { 
  success: true, 
  data: { carId, confidence, make, model, year },
  error: null 
}
```

#### POST /export/shopping-list
Generate parts shopping list.
```javascript
Request: { carId, bodyKit, wheels }
Response: {
  success: true,
  data: {
    car: Car,
    parts: Part[],
    totalPrice: number,
    timestamp: string
  },
  error: null
}
```

### Adding New Endpoints

```javascript
// Pattern for new endpoint
app.get('/your-endpoint', (req, res) => {
  try {
    // Process request
    const result = performLogic(req.query)
    
    // Send response
    sendResponse(res, result)
  } catch (error) {
    sendResponse(res, null, error.message, 500)
  }
})
```

### File Upload Handling

The `/detect` endpoint handles image uploads:

```javascript
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only images allowed'))
    }
  },
})

app.post('/detect', upload.single('file'), async (req, res) => {
  // Image already in req.file
  // Process with AI service
})
```

### Performance Considerations

1. **Caching:**
```javascript
// Add caching for static data
app.get('/cars', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600')
  sendResponse(res, cars)
})
```

2. **Compression:**
```javascript
import compression from 'compression'
app.use(compression())
```

3. **Rate Limiting:**
```javascript
import rateLimit from 'express-rate-limit'
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)
```

---

## AI Service Guide

### FastAPI Setup

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

### Detection Algorithm

Current implementation uses color-based mock detection. For production:

```python
# Integrate real ML model
import tensorflow as tf

model = tf.keras.models.load_model('car_detection_model.h5')

def detect_car(image_data):
    # Preprocess image
    image = preprocess_image(image_data)
    
    # Run inference
    predictions = model.predict(image)
    
    # Post-process and return top match
    return get_top_detection(predictions)
```

### Real Car Detection Implementation

```python
import cv2
import torch
from detect_model import YOLO  # Or your chosen model

model = YOLO('yolov8n.pt')

def detect_car(image_data: bytes) -> Dict:
    # Convert bytes to OpenCV format
    np_array = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    
    # Run YOLO detection
    results = model(image)
    
    # Process results
    detections = results[0]
    car_detections = [d for d in detections if confident_car(d)]
    
    if car_detections:
        # Match to known cars
        return match_to_known_car(car_detections[0])
    
    return None
```

### Extending Detection

1. **Add New Car Models:**
   - Train on more car images
   - Update `KNOWN_CARS` database
   - Improve feature extraction

2. **Improve Accuracy:**
   - Collect more training data
   - Use ensemble methods
   - Fine-tune hyperparameters

3. **Add Year/Trim Detection:**
   - Create separate classifier
   - Use hierarchical detection
   - Implement confidence scoring

---

## Data Management

### Data Structure

#### cars.json
```json
{
  "id": "unique_identifier",
  "make": "Brand",
  "model": "Model Name",
  "year": 2023,
  "trim": "Trim Level",
  "modelPath": "/models/filename.glb",
  "baseColor": "#HEXCODE",
  "compatibleKits": ["kit_id_1", "kit_id_2"],
  "compatibleWheels": ["wheel_id_1"],
  "compatibleLiveries": ["livery_id_1"]
}
```

#### parts.json
```json
{
  "id": "unique_identifier",
  "name": "Display Name",
  "category": "body_kit|wheels|suspension",
  "description": "Short description",
  "price": 5000,
  "compatibility": ["car_id_1", "car_id_2"],
  "thumbnailUrl": "/images/thumbnail.jpg",
  "properties": { "custom": "data" }
}
```

### Data Validation

Add validation in backend:

```javascript
function validateCar(car) {
  const required = ['id', 'make', 'model', 'year', 'modelPath']
  return required.every(field => car[field] !== undefined)
}

app.get('/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === req.params.id)
  
  if (!car || !validateCar(car)) {
    return sendResponse(res, null, 'Invalid car data', 400)
  }
  
  sendResponse(res, car)
})
```

### Adding Data at Scale

Use a data migration script:

```javascript
// migrations/add_cars.js
import fs from 'fs'

const newCars = [
  { id: 'new_car_1', /* ... */ },
  { id: 'new_car_2', /* ... */ },
]

const cars = JSON.parse(fs.readFileSync('./data/cars.json'))
const updated = [...cars, ...newCars]

fs.writeFileSync('./data/cars.json', JSON.stringify(updated, null, 2))
```

---

## Common Issues & Solutions

### Frontend Issues

#### Issue: Models not loading
**Solutions:**
1. Check browser console (F12 → Console tab)
2. Verify model file exists at path
3. Test GLB file validity: https://www.babylonjs-playground.com/
4. Check file size (should be < 10MB)
5. Ensure proper CORS headers if using external CDN

#### Issue: Colors not applying
**Solutions:**
1. Verify hex color format (#RRGGBB)
2. Check if material supports color (see Viewer3D.tsx)
3. Try with metallic toggle
4. Check browser GPU support (try disabling hardware acceleration)

#### Issue: Slow performance
**Solutions:**
1. Reduce 3D model polygon count
2. Compress textures
3. Disable auto-rotation
4. Check browser tab memory usage
5. Use Performance tab in DevTools

### Backend Issues

#### Issue: CORS errors
**Solution:** Update CORS config in server.js:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
```

#### Issue: File upload fails
**Solutions:**
1. Check file size < 10MB
2. Verify MIME type is image/*
3. Ensure /uploads directory exists and is writable
4. Check multer configuration

#### Issue: Detection always returns same car
**Solution:** Improve detection algorithm:
```javascript
// Add more characteristic features
// Use image histogram analysis
// Implement color clustering
// Add shape recognition
```

### AI Service Issues

#### Issue: Python module not found
**Solution:**
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

#### Issue: Port 8000 already in use
**Solution:** Change port in detect.py:
```python
if __name__ == "__main__":
    uvicorn.run(app, port=8001)  # Use different port
```

#### Issue: Detection accuracy low
**Solutions:**
1. Use better training dataset
2. Implement image preprocessing
3. Add confidence thresholding
4. Use transfer learning

---

## Performance Optimization

### Frontend Optimization

1. **Code Splitting:**
```typescript
// lazy-load components
const CustomizationPanel = React.lazy(() => 
  import('./components/CustomizationPanel')
)
```

2. **Memoization:**
```typescript
const Viewer3D = React.memo(({ modelPath, primaryColor }) => {
  // Component only re-renders if props change
})
```

3. **Image Optimization:**
- Use WEBP format when possible
- Compress all images < 100KB
- Lazy load thumbnails

### Backend Optimization

1. **Database Indexing** (when using MongoDB):
```javascript
db.cars.createIndex({ "make": 1, "model": 1 })
```

2. **API Response Caching:**
```javascript
const cache = new Map()

app.get('/cars', (req, res) => {
  if (cache.has('all_cars')) {
    return sendResponse(res, cache.get('all_cars'))
  }
  // Load and cache
})
```

3. **Compression:**
```bash
npm install compression
```

### Network Optimization

1. **Use CDN for static assets**
2. **Enable gzip compression**
3. **Minimize API calls** (batch requests)
4. **Implement pagination** for large lists

---

## Security Considerations

### Input Validation

```javascript
// Validate all inputs
function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>]/g, '')  // Remove potential HTML
    .substring(0, 255)     // Limit length
}

app.post('/export/shopping-list', (req, res) => {
  const carId = sanitizeInput(req.body.carId)
  // Use sanitized input
})
```

### File Upload Security

```javascript
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Invalid file type'))
    }
    // Scan for malware (implement with virus scanner)
    cb(null, true)
  }
})
```

### CORS & CSRF Protection

```javascript
app.use(cors({
  origin: true,  // Restricted in production
  credentials: true
}))

app.use(csrf())  // Add CSRF protection
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests
  message: 'Too many requests'
})

app.use('/detect', limiter)   // Apply to heavy endpoints
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backups scheduled
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] Error logging implemented
- [ ] Monitoring dashboard set up
- [ ] Documentation updated
- [ ] Security audit completed
- [ ] Load testing performed
- [ ] Rollback plan documented
- [ ] Team trained on deployment

---

## Support & Contact

For technical questions or issues:
1. Check troubleshooting sections above
2. Review inline code comments
3. Check git commit history for context
4. Contact development team

**Last Updated:** 2026-03-26  
**Version:** 1.0.0-technical-docs
