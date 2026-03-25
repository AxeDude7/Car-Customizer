# 🔄 Car Customizer - Complete System Architecture

## System Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER (React App)                          │
│                        http://localhost:5173                                │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         Car Customizer UI                             │  │
│  │                                                                       │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐ │  │
│  │  │   Car Upload    │  │   3D Viewer      │  │ Customization      │ │  │
│  │  │   (Detection)   │  │  (Three.js)      │  │ Panel              │ │  │
│  │  │                 │  │  Real-time       │  │ • Kits             │ │  │
│  │  │ • File upload   │  │  • Rotation      │  │ • Wheels           │ │  │
│  │  │ • Preview       │  │  • Zoom          │  │ • Colors           │ │  │
│  │  │ • Confirm       │  │  • Lighting      │  │ • Liveries         │ │  │
│  │  └────────┬────────┘  └────────┬─────────┘  └────────┬───────────┘ │  │
│  │           │                    │                     │              │  │
│  │           └────────────────────┼─────────────────────┘              │  │
│  │                                │                                     │  │
│  │                        React State Management                        │  │
│  │                    (useCarCustomization Hook)                        │  │
│  └──────────────────────────────────────┬──────────────────────────────┘  │
│                                         │                                  │
│                         API Service Layer (axios)                          │
│                                         │                                  │
└─────────────────────────────────────────┼──────────────────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
          HTTP POST/GET           HTTP POST/GET        HTTP POST/GET
                    │                     │                     │
         ┌──────────▼─────────┐ ┌────────▼────────┐ ┌──────────▼─────────┐
         │   BACKEND API      │ │  AI DETECTION   │ │  DATA / STORAGE    │
         │   (Express.js)     │ │  SERVICE        │ │  (JSON Files)      │
         │  localhost:3000    │ │  (FastAPI)      │ │                    │
         │                    │ │ localhost:8000  │ │                    │
         │ ┌────────────────┐ │ │                 │ │ ┌────────────────┐ │
         │ │ GET /cars      │ │ │ POST /detect    │ │ │ cars.json      │ │
         │ │ GET /parts     │ │ │                 │ │ │ parts.json     │ │
         │ │ GET /colors    │ │ │ Image Upload    │ │ │ colors.json    │ │
         │ │ GET /liveries  │ │ │    ▼            │ │ │ liveries.json  │ │
         │ │ POST /detect   │ │ │ Process Image   │ │ │                │ │
         │ │ POST /export   │ │ │    ▼            │ │ │ 5 Cars         │ │
         │ │                │ │ │ ML Detection    │ │ │ 14 Parts       │ │
         │ │ Load from:     │ │ │ (or Mock)       │ │ │ 12 Colors      │ │
         │ │ data/*.json    │ │ │    ▼            │ │ │ 7 Liveries     │ │
         │ │                │ │ │ Return Result   │ │ │                │ │
         │ │ Respond with   │ │ │ {carId,         │ │ │ Linked via:    │ │
         │ │ JSON           │ │ │  confidence,    │ │ │ compatibility  │ │
         │ │                │ │ │  make,          │ │ │ arrays         │ │
         │ └────────────────┘ │ │  model,         │ │ └────────────────┘ │
         │                    │ │  year}          │ │                    │
         └────────────────────┘ └─────────────────┘ └────────────────────┘
                    ▲                    │
                    │                    │
                    └────────────────────┘
                 Response Flows Back to User
```

---

## Component Interaction Diagram

```
                        ┌─────────────────────┐
                        │   User Actions      │
                        │ • Upload Photo      │
                        │ • Confirm Car       │
                        │ • Select Parts      │
                        │ • Change Colors     │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
           ┌─────────────────┐┌──────────────┐┌─────────────────┐
           │ CarDetection    ││ Viewer3D     ││ CustomizationPa │
           │ Component       ││ Component    ││ Panel Component │
           │                 ││              ││                 │
           │ • File Input    ││ • Canvas     ││ • Tabs          │
           │ • Preview       ││ • Animation  ││ • Parts List    │
           │ • Detect        ││ • Lighting   ││ • Color Picker  │
           │ • Confirm       ││ • Materials  ││ • Liveries      │
           └────────┬────────┘└──────┬───────┘└────────┬────────┘
                    │                │                │
                    │      useCarCustomization Hook   │
                    │              │                  │
                    └──────────────┼──────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                            │
                    ▼                            ▼
           ┌─────────────────┐        ┌──────────────────┐
           │ App State       │        │ API Service      │
           │                 │        │                  │
           │ • selectedCar   │────────│ • carService     │
           │ • customization │────────│ • partService    │
           │ • colors        │────────│ • colorService   │
           │ • detected      │────────│ • liveryService  │
           │ • isLoading     │────────│ • detectionSvc   │
           │ • currentTab    │        │ • exportService  │
           └─────────────────┘        └──────────────────┘
                    │
                    │
                    ▼
           ┌─────────────────────┐
           │  Backend (Axios)    │
           │  HTTP Requests      │
           └────────┬────────────┘
                    │
        ┌───────────┼────────────┬──────────────┐
        │           │            │              │
        ▼           ▼            ▼              ▼
   ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
   │ GET /  │ │ POST / │ │ JSON    │ │ Python  │
   │ cars   │ │ detect │ │ Data    │ │ AI      │
   │        │ │        │ │ Files   │ │ Service │
   └────────┘ └────────┘ └─────────┘ └──────────┘
```

---

## Data Flow Example: User Workflow

```
1. USER UPLOADS CAR PHOTO
   │
   └─► CarDetection Component
       ├─► Shows file upload UI
       ├─► User selects image
       └─► Sends to Backend /detect

2. BACKEND RECEIVES IMAGE
   │
   └─► server.js (POST /detect)
       ├─► Receives file with multer
       ├─► Sends to AI Service
       └─► Returns detection result

3. AI SERVICE PROCESSES IMAGE
   │
   └─► detect.py
       ├─► Validates image
       ├─► Analyzes image (color-based or ML)
       ├─► Matches to known car
       └─► Returns: {carId, confidence, make, model, year}

4. FRONTEND DISPLAYS RESULTS
   │
   └─► CarDetection Component
       ├─► Shows detected car info
       ├─► Shows confidence score
       ├─► User confirms selection
       └─► Calls onConfirm callback

5. APP LOADS CAR DATA
   │
   └─► handleConfirmCar()
       ├─► Calls carService.getById(carId)
       ├─► Loads car from backend
       ├─► Resets customization state
       └─► Switches to customization mode

6. 3D VIEWER LOADS MODEL
   │
   └─► Viewer3D Component
       ├─► Receives modelPath from car
       ├─► Loads .glb file
       ├─► Creates Three.js scene
       ├─► Adds lighting
       └─► Starts auto-rotation

7. USER SELECTS CUSTOMIZATIONS
   │
   └─► CustomizationPanel Component
       ├─► Loads compatible parts
       ├─► Displays tabs (Kit/Wheels/Color/Livery)
       ├─► User selects options
       └─► Calls update callbacks

8. STATE UPDATES IN REAL-TIME
   │
   └─► useCarCustomization Hook
       ├─► Updates customization state
       ├─► Triggers component re-renders
       └─► Passes new values to children

9. 3D VIEWER UPDATES
   │
   └─► Viewer3D Component
       ├─► Receives new primaryColor
       ├─► Updates Three.js materials
       ├─► Re-renders scene
       └─► User sees immediate changes

10. USER EXPORTS CUSTOMIZATION
    │
    └─► Footer export button
        ├─► Calls exportService.getShoppingList()
        ├─► Backend generates parts list with prices
        ├─► Frontend displays/downloads result
        └─► User gets shopping list & images
```

---

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                                      │
├──────────────────────┬──────────────────────┬──────────────────────────────┤
│   React 18           │   Vite 5             │   Three.js (WebGL)            │
│   ├─ Components      │   ├─ Dev Server      │   ├─ 3D Visualization         │
│   ├─ Hooks           │   ├─ Hot Reload      │   ├─ Materials & Lighting     │
│   ├─ State Mgmt      │   ├─ Build Tool      │   ├─ Orbit Controls           │
│   └─ TypeScript      │   └─ Optimization    │   └─ Animation Loop           │
│                      │                      │                                │
│   Axios HTTP Client  │   CSS3 Styling       │   Web GL / GPU Rendering      │
└──────────────────────┴──────────────────────┴──────────────────────────────┘
                              ↕ REST API (JSON)
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                                        │
├───────────────────────────────────────────────────────────────────────────┤
│  Express.js 4.18                    Multer File Upload                       │
│  ├─ Routing                         ├─ Multipart form data                   │
│  ├─ Middleware/CORS                 ├─ File validation                       │
│  ├─ Request/Response                └─ Size limits (10MB)                    │
│  ├─ Error Handling                                                            │
│  └─ Static File Serving             Node.js Runtime                          │
│                                      ├─ Event-driven I/O                      │
└───────────────────────────────────────────────────────────────────────────┘
                              ↕ HTTP POST/GET
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI SERVICE LAYER                                     │
├───────────────────────────────────────────────────────────────────────────┤
│  FastAPI 0.104                      Python 3.8+                              │
│  ├─ Web Framework                   ├─ NumPy (Numeric computing)             │
│  ├─ Async Support                   ├─ Pillow (Image processing)             │
│  ├─ Auto Documentation              └─ Ready for TensorFlow/PyTorch         │
│  ├─ CORS Middleware                                                           │
│  └─ Request Validation              Uvicorn Server                           │
│                                      ├─ ASGI Application Server              │
└───────────────────────────────────────────────────────────────────────────┘
                              ↕ JSON Data
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                          │
├───────────────────────────────────────────────────────────────────────────┤
│  JSON Configuration Files           Static Assets                            │
│  ├─ cars.json      (Car catalog)    ├─ .glb Files  (3D Models)              │
│  ├─ parts.json     (Kits/wheels)    ├─ Images      (Thumbnails)             │
│  ├─ colors.json    (Color palette)  └─ Textures    (Materials)              │
│  └─ liveries.json  (Paint schemes)                                           │
│                                      Future: MongoDB Integration              │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## File Organization Hierarchy

```
car-customizer/
│
├── 📄 DOCUMENTATION (Read These)
│   ├── START_HERE.md ........................ Read this first!
│   ├── README.md ............................. Complete guide
│   ├── QUICK_REFERENCE.md ................... Cheat sheet
│   ├── TECHNICAL_DOCUMENTATION.md .......... Architecture
│   ├── TROUBLESHOOTING.md .................. Problem solving
│   ├── UPDATE_AND_EXTEND.md ................ Feature guide
│   ├── FILE_MANIFEST.md .................... File inventory
│   ├── DOCUMENTATION_MAP.md ................ Navigation
│   └── PROJECT_COMPLETION_SUMMARY.md ...... Overview
│
├── 🚀 AUTOMATION
│   ├── run.bat ............................. Windows startup
│   └── .gitignore .......................... Git config
│
├── 🎨 FRONTEND (http://localhost:5173)
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── App.tsx (Main app container)
│       │   │   ├── Viewer3D.tsx (3D visualization)
│       │   │   ├── CustomizationPanel.tsx (Parts selector)
│       │   │   ├── CarDetection.tsx (Upload interface)
│       │   │   └── *.css (Styling)
│       │   │
│       │   ├── hooks/
│       │   │   └── useCarCustomization.ts (State)
│       │   │
│       │   ├── services/
│       │   │   └── api.ts (API client)
│       │   │
│       │   ├── types/
│       │   │   └── index.ts (TypeScript types)
│       │   │
│       │   ├── main.tsx (Entry point)
│       │   ├── App.css (Main styles)
│       │   └── index.css (Global styles)
│       │
│       ├── index.html (HTML template)
│       ├── vite.config.ts (Build config)
│       ├── tsconfig.json (TypeScript config)
│       ├── package.json (Dependencies)
│       └── .env.example (Example env file)
│
├── 🖥️ BACKEND (http://localhost:3000)
│   └── backend/
│       ├── server.js (Express server - 350+ lines)
│       ├── package.json (Dependencies)
│       └── public/ (Static files)
│
├── 🐍 AI SERVICE (http://localhost:8000)
│   └── ai-service/
│       ├── detect.py (FastAPI app - 280+ lines)
│       ├── requirements.txt (Python packages)
│       └── venv/ (Virtual environment)
│
└── 📊 DATA (Configuration)
    └── data/
        ├── cars.json (5 car models)
        ├── parts.json (14 parts)
        ├── colors.json (12 colors)
        └── liveries.json (7 liveries)
```

---

## API Endpoint Map

```
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND RESTFUL API ENDPOINTS                      │
│                (http://localhost:3000)                          │
└─────────────────────────────────────────────────────────────────┘

📚 CAR CATALOG ENDPOINTS
├─ GET /cars
│  └─ Returns: Array of all car objects
│
├─ GET /cars/:id
│  ├─ Parameter: carId (e.g., "lamborghini_aventador_2012")
│  └─ Returns: Single car object with all configurations
│
├─ GET /cars/:id/compatibility
│  └─ Returns: All compatible parts for car

🔧 PARTS ENDPOINTS
├─ GET /parts
│  └─ Returns: Array of all parts
│
├─ GET /parts?category=body_kit
│  ├─ Filter: category (body_kit, wheels, suspension, etc.)
│  └─ Returns: Filtered array
│
├─ GET /parts/:id
│  ├─ Parameter: partId (e.g., "liberty_walk")
│  └─ Returns: Single part object with price & specs

🎨 COLORS ENDPOINTS
├─ GET /colors
│  └─ Returns: Array of all available colors
│
├─ GET /colors/:id
│  ├─ Parameter: colorId (e.g., "matte_black")
│  └─ Returns: Color object with hex code & properties

✨ LIVERIES ENDPOINTS
├─ GET /liveries
│  └─ Returns: Array of all paint schemes
│
├─ GET /liveries?car=lamborghini_aventador_2012
│  ├─ Filter: car (compatible cars only)
│  └─ Returns: Filtered livery array
│
├─ GET /liveries/:id
│  ├─ Parameter: liveryId (e.g., "racing_stripe")
│  └─ Returns: Livery object with pattern & colors

🤖 AI DETECTION ENDPOINT
├─ POST /detect
│  ├─ Request: multipart/form-data { file: Image }
│  ├─ Process: Send to Python AI service
│  └─ Response: { carId, confidence, make, model, year }

💾 EXPORT ENDPOINTS
├─ POST /export/shopping-list
│  ├─ Request: { carId, bodyKit, wheels }
│  ├─ Calculate: Total parts price
│  └─ Response: { parts[], totalPrice, timestamp }
│
├─ POST /export/image
│  ├─ Request: Customization data
│  └─ Response: Image file (screenshot)

❤️ HEALTH CHECK
├─ GET /health
│  └─ Returns: { status: "OK", timestamp }

```

---

## Request/Response Example

```javascript
// EXAMPLE: Get Car Details

REQUEST:
GET http://localhost:3000/cars/lamborghini_aventador_2012

RESPONSE (200 OK):
{
  "success": true,
  "data": {
    "id": "lamborghini_aventador_2012",
    "make": "Lamborghini",
    "model": "Aventador",
    "year": 2012,
    "trim": "LP700-4",
    "modelPath": "/models/lamborghini_aventador_2012.glb",
    "baseColor": "#FFD700",
    "compatibleKits": [
      "liberty_walk",
      "mansory",
      "hamann"
    ],
    "compatibleWheels": [
      "adv1_19",
      "hre_19",
      "rotiform_20"
    ],
    "compatibleLiveries": [
      "matte_black",
      "carbon_black",
      "racing_stripe"
    ]
  },
  "error": null
}
```

---

## Data Model Relationships

```
CAR
├─ id, make, model, year, trim
├─ modelPath (links to .glb file)
├─ baseColor (hex code)
│
├─ compatibleKits[] ────────┐
│                           │
├─ compatibleWheels[] ──────┤
│                           │
└─ compatibleLiveries[] ────┤
                            │
                            ▼
                         PARTS
                        ├─ id
                        ├─ name
                        ├─ category
                        ├─ price
                        └─ properties[]

                         COLORS
                        ├─ id
                        ├─ name
                        ├─ hexCode
                        ├─ metallic
                        └─ category

                         LIVERIES
                        ├─ id
                        ├─ name
                        ├─ primaryColor
                        ├─ secondaryColor
                        └─ pattern
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                       │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │    CDN/Vercel    │    │   AWS/Heroku     │                  │
│  │   (Frontend)     │    │   (Backend)      │                  │
│  │                  │    │                  │                  │
│  │ • React Build    │    │ • Node.js Server │                  │
│  │ • Static Assets  │    │ • Express App    │                  │
│  │ • Edge Caching   │    │ • MongoDB        │                  │
│  └────────┬─────────┘    └────────┬─────────┘                  │
│           │                       │                             │
│           └───────────┬───────────┘                             │
│                       │                                         │
│           ┌───────────▼───────────┐                             │
│           │   GCP/AWS Lambda      │                             │
│           │   (AI Service)        │                             │
│           │ • Python FastAPI      │                             │
│           │ • ML Models           │                             │
│           │ • GPU Support         │                             │
│           └───────────────────────┘                             │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │              Monitoring & Logging                          ││
│  │  • Sentry (Error tracking)                                ││
│  │  • New Relic (Performance)                                ││
│  │  • CloudWatch (AWS Logs)                                  ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Browser to Server Communication

```
┌──────────────────────────────────┐
│    User Browser (Client)         │
│  • React App (SPA)               │
│  • Three.js Viewer               │
│  • Axios HTTP Client             │
└──────────────┬───────────────────┘
               │
               │ HTTPS Request
               ▼
┌──────────────────────────────────┐
│     Internet / Network Cloud     │
│  • DNS Resolution                │
│  • SSL/TLS Encryption            │
│  • Load Balancing                │
└──────────────┬───────────────────┘
               │
        HTTPS Response
               │
               ▼
┌──────────────────────────────────┐
│  Production Servers              │
│                                  │
│  ┌────────────────────────────┐ │
│  │ Frontend Hosting           │ │
│  │ (Vercel/Netlify/S3)        │ │
│  │ Serves: HTML, JS, CSS      │ │
│  └────────────┬───────────────┘ │
│               │                  │
│  ┌────────────▼───────────────┐ │
│  │ Backend API                │ │
│  │ (Heroku/AWS/Railway)       │ │
│  │ Serves: JSON responses     │ │
│  │ Processes: Business logic  │ │
│  └────────────┬───────────────┘ │
│               │                  │
│  ┌────────────▼───────────────┐ │
│  │ AI Service                 │ │
│  │ (GCP/AWS Lambda)           │ │
│  │ Serves: Car detection      │ │
│  │ Processes: ML inference    │ │
│  └────────────┬───────────────┘ │
│               │                  │
│  ┌────────────▼───────────────┐ │
│  │ Database                   │ │
│  │ (MongoDB/PostgreSQL)       │ │
│  │ Stores: Cars, users, cust. │ │
│  └────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

---

**This is your complete car customizer system!**

Everything is built, integrated, and ready to run. 🚗✨
