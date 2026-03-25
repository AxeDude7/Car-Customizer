# 🚗 Car Customizer

A sophisticated web application that allows users to customize cars in real-time using AI car detection, 3D visualization, and a comprehensive customization suite.

## ✨ Features

- **AI Car Detection**: Upload a photo of any car and the app automatically detects the make, model, and year
- **3D Vehicle Viewer**: Real-time rotating 3D model visualization using Three.js
- **Body Kit Customization**: Apply licensed body kits (Liberty Walk, Mansory, NISMO, etc.)
- **Wheel Selection**: Choose from authentic wheel designs
- **Color Customization**: Huge palette of metallic and matte colors
- **Livery & Wraps**: Apply racing stripes, carbon fiber, and custom paint schemes
- **Export & Sharing**: Save customizations with shopping lists and shareable links
- **Real-time Updates**: See changes instantly in the 3D viewer

## 📋 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)              │
│  • Three.js 3D Viewer  • Customization Panel           │
│  • Car Detection UI    • Real-time Updates             │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────▼────────┐ ┌────┴─────────────┐ │
│  Backend API    │ │ AI Service       │ │
│  (Express.js)   │ │ (FastAPI)        │ │
│  • Car Routes   │ │ • Detection      │ │
│  • Parts API    │ │ • Classification │ │
│  • Export       │ └──────────────────┘ │
└────────┬────────┘                      │
         │                               │
┌────────▼──────────────────────────────┴───────┐
│            Data Layer (JSON + Assets)         │
│  • cars.json  • parts.json                    │
│  • colors.json  • liveries.json               │
│  • 3D Models (.glb files)                     │
└───────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **Python** (v3.8 or higher): [Download](https://www.python.org/)
- **Git**: [Download](https://git-scm.com/)

### Installation & Running

#### Option 1: Automatic (Recommended for Windows)

Simply run the batch file:

```bash
run.bat
```

This will automatically:
- Install all dependencies
- Start the Frontend (Vite dev server)
- Start the Backend (Express API)
- Start the AI Service (FastAPI)

#### Option 2: Manual Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

**Backend:**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:3000
```

**AI Service:**
```bash
cd ai-service
python -m venv venv          # Create virtual environment
venv\Scripts\activate        # Activate (Windows)
pip install -r requirements.txt
python detect.py
# Runs on http://localhost:8000
```

## 📁 Project Structure

```
car-customizer/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                  # Node.js + Express
│   ├── server.js            # Express server
│   ├── package.json
│   └── public/              # Static files
│
├── ai-service/              # Python + FastAPI
│   ├── detect.py            # Detection endpoint
│   ├── requirements.txt     # Python dependencies
│   └── venv/                # Virtual environment
│
├── data/                     # Data files
│   ├── cars.json            # Car catalog
│   ├── parts.json           # Parts & kits
│   ├── colors.json          # Colors palette
│   └── liveries.json        # Paint schemes
│
├── run.bat                   # Startup script (Windows)
├── README.md                 # This file
└── .gitignore
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=Car Customizer
```

### Backend Configuration

Edit `backend/server.js` to customize:
- PORT (default: 3000)
- CORS origins
- File upload limits

### AI Service Configuration

Edit `ai-service/detect.py` to customize:
- Detection confidence thresholds
- Supported car models
- Detection algorithm

## 📚 API Endpoints

### Cars
- `GET /cars` - Get all available cars
- `GET /cars/:id` - Get specific car details

### Parts
- `GET /parts` - Get all parts
- `GET /parts?category=wheels` - Filter by category
- `GET /parts/:id` - Get specific part

### Colors
- `GET /colors` - Get all available colors
- `GET /colors/:id` - Get specific color

### Liveries
- `GET /liveries` - Get all liveries
- `GET /liveries?car=lamborghini_aventador_2012` - Filter by car
- `GET /liveries/:id` - Get specific livery

### AI Detection
- `POST /detect` - Upload image for car detection
  - Request: `multipart/form-data` with `file` field
  - Response: `{carId, confidence, make, model, year}`

### Export
- `POST /export/shopping-list` - Generate parts shopping list
- `POST /export/image` - Export customization image

## 🎨 Adding New Content

### Adding a New Car

Edit `data/cars.json`:

```json
{
  "id": "your_car_id",
  "make": "Brand Name",
  "model": "Model Name",
  "year": 2023,
  "trim": "Trim Level",
  "modelPath": "/models/your_car.glb",
  "baseColor": "#HEXCOLOR",
  "compatibleKits": ["kit_id_1", "kit_id_2"],
  "compatibleWheels": ["wheel_id_1"],
  "compatibleLiveries": ["livery_id_1"]
}
```

### Adding a New Body Kit

Edit `data/parts.json`:

```json
{
  "id": "new_kit",
  "name": "Kit Name",
  "category": "body_kit",
  "description": "Description",
  "price": 5000,
  "compatibility": ["car_id_1", "car_id_2"],
  "thumbnailUrl": "/images/kit.jpg",
  "properties": {
    "spoiler": true,
    "diffuser": true
  }
}
```

### Adding Colors

Edit `data/colors.json`:

```json
{
  "id": "new_color",
  "name": "Color Name",
  "hexCode": "#HEXCODE",
  "metallic": true,
  "category": "premium"
}
```

### Adding 3D Models

1. Prepare your 3D model in Blender or 3DS Max
2. Export as `.glb` format
3. Place in `public/models/` folder
4. Reference in `cars.json` with `modelPath`

## 🔄 Troubleshooting

### Port Already in Use

If ports are already occupied:

**Frontend (5173):**
```bash
cd frontend
npm run dev -- --port 5174
```

**Backend (3000):**
Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001
```

**AI Service (8000):**
Edit `ai-service/detect.py`:
```python
uvicorn.run(app, port=8001)
```

### Dependencies Installation Fails

**Node.js:**
```bash
npm cache clean --force
npm install
```

**Python:**
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### AI Detection Not Working

1. Check if Python service is running on http://localhost:8000/health
2. Verify image upload file size < 10MB
3. Check console logs for error details
4. Restart the AI service

### 3D Model Not Loading

1. Verify `.glb` file path in `cars.json`
2. Check browser console for errors (F12)
3. Ensure model is properly formatted (use [Babylon.js Sandbox](https://www.babylonjs-playground.com/) to validate)
4. Check file encoding and permissions

## 📝 Customization Guide

### Styling

Global styles are in `frontend/src/index.css`. Colors are defined in CSS variables:

```css
:root {
  --primary-color: #1a1a2e;
  --secondary-color: #16213e;
  --accent-color: #0f3460;
  --text-color: #eaeaea;
  --success-color: #06d6a0;
}
```

### Adding New Components

1. Create `.tsx` file in `frontend/src/components/`
2. Create accompanying `.css` file
3. Import and use in `App.tsx`

Example:
```typescript
import MyComponent from './components/MyComponent'

// In App component
<MyComponent prop="value" />
```

### Extending the API

Add new routes in `backend/server.js`:

```javascript
app.post('/custom-endpoint', (req, res) => {
  // Your logic
  sendResponse(res, data)
})
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy 'dist' folder
```

### Backend Deployment (Heroku/AWS)

```bash
cd backend
npm install
npm start
```

Set environment variable: `NODE_ENV=production`

### AI Service Deployment (GCP/AWS Lambda)

```bash
cd ai-service
pip install -r requirements.txt
```

## 📋 Checklist for Adding Features

- [ ] Update TypeScript types in `frontend/src/types/`
- [ ] Add API service methods in `frontend/src/services/api.ts`
- [ ] Create React component for UI
- [ ] Add styling with CSS
- [ ] Add backend route in `backend/server.js`
- [ ] Update data files if needed
- [ ] Test end-to-end
- [ ] Update documentation

## 🤝 Contributing

To contribute:

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m 'Add new feature'`
5. Push: `git push origin feature/new-feature`
6. Create Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support & Issues

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [API Documentation](#-api-endpoints)
3. Check browser console (F12) for error messages
4. Review server logs in terminal

## 🎯 Roadmap

- [ ] Real ML model integration for car detection
- [ ] MongoDB integration for user accounts
- [ ] Multiplayer customization sessions
- [ ] AR view on mobile devices
- [ ] Paint job simulator with realistic lighting
- [ ] Performance tuning calculator
- [ ] Community gallery and sharing
- [ ] Mobile app (React Native)

## 💡 Tips & Tricks

### Performance Optimization

- Use lower polygon count for 3D models
- Optimize images to < 100KB
- Enable caching in backend
- Use CDN for static assets

### Better Car Detection

- Use high-quality, well-lit car photos
- Ensure entire car is visible
- Avoid extreme angles or shadows
- Use close-up shots for better accuracy

### 3D Model Quality

- Models should be < 5MB in size
- Use textures efficiently
- Ensure proper UV mapping
- Test in Babylon.js Sandbox before use

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-26  
**Status:** ✅ Production Ready
