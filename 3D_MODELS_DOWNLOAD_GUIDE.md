# 🚗 3D Car Model Integration Guide

## ⚡ TLDR - Fastest Way to Get Started

```
1. Run: run-all.bat (starts everything + model watcher)
2. Download .glb from sketchfab.com
3. Save to: Car files\ folder
4. Watch the PowerShell window - file auto-syncs!
5. Edit: backend/data/cars.json (add modelPath)
6. Refresh: http://localhost:5175
```

## Quick Start - Download Models from SketchFab

### Step 1: Find Models on SketchFab

1. Visit **[sketchfab.com](https://sketchfab.com)**
2. Search for car models (try: "Lamborghini", "Ferrari", "Nissan", etc.)
3. **Filter by:**
   - ✅ **Downloadable** 
   - ✅ **File format: GLB or GLTF**
   - ✅ **Free** (or paid if preferred)

### Step 2: Download Model

1. Find a model you like
2. Click on the model to open details page
3. Click **"Download"** button (might be in 3D viewer or model info)
4. Choose **GLB format** (GLB is better than GLTF for single files)
5. Save to: `Car-Customizer/Car files/` folder

### Step 3: Prepare Model File

**Rename downloaded file to match pattern:**

```
lamborghini_aventador_2012.glb
ferrari_f430.glb
nissan_skyline_r34.glb
porsche_911_turbo.glb
mclaren_720s.glb
bugatti_chiron.glb
```

### Step 4: Copy to Project

Move the `.glb` file to:
```
Car-Customizer/frontend/public/models/[car_name].glb
```

Example:
```
frontend/public/models/lamborghini_aventador_2012.glb
frontend/public/models/ferrari_f430.glb
frontend/public/models/nissan_skyline_r34.glb
```

**✨ AUTOMATIC OPTION (Recommended):**

If you're running `run-all.bat`, the **Model Watcher** runs automatically! Just:
1. Save `.glb` to `Car files\` folder
2. Watcher auto-syncs to `frontend/public/models/`
3. Check the PowerShell "Model Watcher" window for sync confirmation

**Manual Option:**
- Run `copy-models.bat`
- Or PowerShell: `.\copy-models.ps1`

### Step 5: Update Backend Data

Edit `backend/data/cars.json` and add your car with the correct **modelPath**:

```json
{
  "id": "lamborghini-aventador-2012",
  "make": "Lamborghini",
  "model": "Aventador LP700-4",
  "year": 2012,
  "price": 397500,
  "modelPath": "/models/lamborghini_aventador_2012.glb",
  "thumbnail": "/thumbnails/lamborghini_aventador.jpg",
  "specs": {
    "engine": "5.2L V12",
    "horsepower": 700,
    "torque": 509,
    "acceleration": "0-60: 2.9s",
    "topSpeed": 217
  }
}
```

### Step 6: Restart Services

```bash
# If using run-all.bat:
# Just close and restart it - everything restarts together!

# If running manually:
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend  
cd frontend
npm run dev

# The car should now appear in the app!
```

---

## Recommended SketchFab Models

### Search Terms That Work Well:
- "Lamborghini Aventador free"
- "Ferrari F430 downloadable"
- "Nissan Skyline R34"
- "Porsche 911 high poly"
- "McLaren 720S model"
- "Bugatti Chiron lowpoly"

### Quality Tips:
- ✅ Look for models with **100K-500K polygons** (good balance of detail vs performance)
- ✅ Check if author is **reputable** (look at reviews)
- ✅ Verify model is a **car** (not a scene or environment)
- ✅ Prefer **single mesh** models (easier to customize)
- ✅ Check **license** - ensure free to use for your project

---

## File Structure After Setup

```
Car-Customizer/
├── frontend/
│   ├── public/
│   │   └── models/
│   │       ├── lamborghini_aventador_2012.glb
│   │       ├── ferrari_f430.glb
│   │       ├── nissan_skyline_r34.glb
│   │       ├── porsche_911_turbo.glb
│   │       ├── mclaren_720s.glb
│   │       └── bugatti_chiron.glb
│   └── src/
├── backend/
│   └── data/
│       ├── cars.json              (← contains modelPath for each car)
│       ├── parts.json
│       ├── colors.json
│       └── liveries.json
└── Car files/                      (← Download folder - save .glb files here)
    └── [Downloaded Models]
```

---

## How It Works

### 1. **Model Selection**
   - User selects car → App loads `cars.json` → Gets the `modelPath`

### 2. **3D Loading**
   - Frontend passes `modelPath` to `Viewer3D` component
   - Component uses **Three.js GLTFLoader** to load the `.glb` file
   - If model fails to load → Falls back to procedural car (won't break app)

### 3. **Color Customization**
   - When user changes color → Material colors update in real-time
   - Works with **real models** because renderer traverses all mesh materials
   - Each mesh gets the selected primary color applied

### 4. **Real-Time Rendering**
   - Orbit controls let user rotate 3D model
   - Lighting system shows depth and details
   - Shadow mapping creates realistic appearance

---

## Troubleshooting

### Model Not Appearing?

**1. Check file exists:**
```cmd
dir frontend\public\models\lamborghini_aventador_2012.glb
```

**2. Check cars.json has correct path:**
```json
"modelPath": "/models/lamborghini_aventador_2012.glb"  ✅
```
NOT:
```json
"modelPath": "lamborghini_aventador_2012.glb"  ❌
```

**3. Browser console errors?**
- Open DevTools (F12)
- Check Console tab for error messages
- Usually shows 404 if file not found

### Model Appears But Looks Wrong?

- Model might be **very large** - adjust camera position in `Viewer3D.tsx`
- Model might be **upside down** - add `.rotationX = Math.PI/2` to rotate
- Model might have **internal lighting** - adjust material properties

### Color Customization Not Working?

- Real models might have **pre-baked textures** (colors won't change)
- Solution: Use models with **simple materials** (not complex textures)
- Or modify `Viewer3D.tsx` to handle texture-based models

---

## Performance Tips

### Large Models (>5MB)?
- Use an **online tool** to optimize .glb files:
  - glb-packer.appspot.com
  - Don't Mesh With Me Blender add-on

### Too Many Polygons?
- Download "Low Poly" version from SketchFab if available
- Or use Blender to reduce polygon count

### Smooth Performance:
- Keep models under **2MB** each
- Keep under **300K polygons** per model
- Use only **2 or 3 real models** for testing

---

## ⚡ Model Watcher (Automatic Sync)

The **Model Watcher** is a real-time file monitor that auto-syncs `.glb` files from `Car files\` to `frontend/public/models/`.

### How It Works:

1. **Starts automatically** with `run-all.bat`
2. **Monitors** the `Car files\` folder
3. **Detects** new or updated `.glb` files
4. **Auto-copies** to `frontend/public/models/`
5. **Shows status** in PowerShell window

### Example Workflow:

```
1. run-all.bat is running
   ├─ Backend: http://localhost:3001
   ├─ Frontend: http://localhost:5175
   ├─ AI: http://localhost:8000
   └─ Watcher: Monitoring Car files\

2. You download: lamborghini_aventador_2012.glb

3. Save to: Car files\lamborghini_aventador_2012.glb

4. PowerShell window shows:
   "12:34:56 | 📥 Copying: lamborghini_aventador_2012.glb (5.23 MB)"
   "          ✓ Synced to: /models/lamborghini_aventador_2012.glb"

5. File is now at: frontend/public/models/lamborghini_aventador_2012.glb

6. Edit backend/data/cars.json and add:
   "modelPath": "/models/lamborghini_aventador_2012.glb"

7. Refresh browser - model shows immediately!
```

### Manual Watcher (Advanced):

If you want to run just the watcher without other services:

```powershell
.\watch-models.ps1
```

---

**Windows PowerShell:**
```powershell
# Copy downloaded model to project
Copy-Item -Path "C:\Users\Abhimanyu Vishwakarm\OneDrive\Documents\GitHub\Car-Customizer\Car files\[model].glb" `
  -Destination "C:\Users\Abhimanyu Vishwakarm\OneDrive\Documents\GitHub\Car-Customizer\frontend\public\models\[new_name].glb"
```

**Then update `backend/data/cars.json`** with the new car entry.

---

## Next Steps

1. ✅ Download 1-2 car models from SketchFab
2. ✅ Place them in `frontend/public/models/`
3. ✅ Update `backend/data/cars.json`
4. ✅ Restart both services
5. ✅ Test in app at http://localhost:5175

**That's it!** Your real 3D models are now live in the Car Customizer! 🎉
