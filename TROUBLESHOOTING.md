# 🔍 Troubleshooting Guide - Car Customizer

## Quick Diagnosis

Run this command to check your system:

```bash
node --version    # Should be v16+
python --version  # Should be 3.8+
npm --version     # Should be 8+
```

All commands should return versions without errors.

---

## Common Issues by Service

### 🎨 Frontend Issues

#### Loading Blank Page or Errors

**Symptoms:** Gray screen, nothing loads, browser console shows errors

**Solutions:**

1. **Clear cache and reload:**
   ```bash
   Ctrl + Shift + Delete (Ctrl + Cmd + Delete on Mac)
   # Clear all cache
   # Reload page
   ```

2. **Check dependencies:**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   npm run dev
   ```

3. **Check Vite configuration:**
   - Verify `vite.config.ts` exists
   - Check proxy configuration points to `localhost:3000`
   - Verify port 5173 is not in use

4. **Check console errors (F12):**
   - If CORS error: Backend might not be running
   - If "Cannot find module": Dependencies not installed
   - If API errors: Check backend URL in `.env`

---

#### 3D Model Not Displaying

**Symptoms:** Viewer area is black/gray, no 3D car visible

**Diagnose:**
```bash
# Check if model file exists
ls -la frontend/public/models/

# Test GLB file validity
# Upload to https://www.babylonjs-playground.com/
```

**Solutions:**

1. **Add default fallback model:**
   ```typescript
   // In Viewer3D.tsx
   const pathToLoad = modelPath || '/models/lamborghini_aventador_2012.glb'
   ```

2. **Check model file:**
   ```bash
   # File should exist
   ls -la frontend/public/models/
   
   # File should be reasonable size (1-20MB)
   du -sh frontend/public/models/model.glb
   
   # Try converting if corrupted
   # Use Blender: Export → glTF 2.0 (.glb)
   ```

3. **Check browser GPU:**
   - Open DevTools (F12)
   - Console → `WebGLRenderingContext.getSupportedExtensions()`
   - Should return many extensions

4. **Lower graphics quality:**
   ```typescript
   // In Viewer3D.tsx, reduce quality:
   renderer.setPixelRatio(window.devicePixelRatio * 0.75)
   ```

---

#### Colors Not Changing or Applying Incorrectly

**Symptoms:** Car stays one color despite selection, wrong color displayed

**Diagnose:**
```bash
# Browser console
console.log(customization.primaryColor)  # Should return hex color
```

**Solutions:**

1. **Fix color format:**
   - Ensure format is `#RRGGBB` (lowercase or uppercase)
   - Invalid: `#GGG`, `rgb(255,0,0)`, `red`
   - Valid: `#FF0000`, `#ffaa00`

2. **Check material settings:**
   ```typescript
   // In Viewer3D.tsx
   if (child.material instanceof THREE.MeshStandardMaterial) {
     child.material.color.setHex(primaryColor.replace('#', '0x'))
     child.material.metalness = 0.5  // Adjust for more/less shine
     child.material.roughness = 0.5
   }
   ```

3. **Enable metallic effect:**
   ```typescript
   child.material.metalness = 1.0  // Full metallic
   child.material.roughness = 0.3  // Shiny
   ```

---

#### Performance Issues / Stuttering

**Symptoms:** Low FPS, laggy 3D rotation, CPU/GPU at 100%

**Diagnose:**
```bash
# In browser DevTools
# Performance tab → Record → Rotate model → Analyze
```

**Solutions:**

1. **Reduce model complexity:**
   ```bash
   # In Blender:
   # 1. Import model
   # 2. Modifiers → Decimate (reduce ~50%)
   # 3. Export as GLB
   ```

2. **Optimize lighting:**
   ```typescript
   // In Viewer3D.tsx, reduce light count
   // Remove point light if not needed
   // Don't add shadow maps to directional light
   ```

3. **Disable auto-rotation:**
   ```typescript
   controls.autoRotate = false  // Manual control only
   ```

4. **Reduce draw calls:**
   - Merge textures
   - Use simpler models
   - Remove unnecessary details

5. **Check system resources:**
   ```bash
   # Windows
   tasklist | find "node"
   
   # macOS
   ps aux | grep node
   
   # Kill extra processes
   ```

---

### 🖥️ Backend Issues

#### Cannot Start Backend / Port Already in Use

**Symptoms:** 
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Find and kill process using port 3000:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   ```

2. **Use different port:**
   ```bash
   # Run on port 3001
   PORT=3001 npm start
   
   # Update frontend proxy in vite.config.ts
   proxy: {
     '/api': {
       target: 'http://localhost:3001',
   ```

3. **Check running processes:**
   ```bash
   # List all Node processes
   ps aux | grep node
   ```

---

#### API Endpoints Returning Errors

**Symptoms:** 404 errors, malformed responses, data not loading

**Diagnose:**
```bash
# Test endpoint directly
curl http://localhost:3000/cars
curl http://localhost:3000/health
```

**Solutions:**

1. **Check data files exist:**
   ```bash
   ls -la data/
   # Should show: cars.json, parts.json, colors.json, liveries.json
   ```

2. **Validate JSON syntax:**
   ```bash
   # Copy JSON to https://jsonlint.com/
   # Check for syntax errors
   ```

3. **Fix file paths:**
   ```javascript
   // server.js - Check path.join() paths are correct
   const carsPath = path.join(__dirname, '..', 'data', 'cars.json')
   ```

4. **Check CORS configuration:**
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173',  // Frontend URL
     credentials: true
   }))
   ```

---

#### File Upload Failing

**Symptoms:** 
```
Upload fails silently
413 Payload Too Large
415 Unsupported Media Type
```

**Solutions:**

1. **Check file size limit:**
   ```javascript
   // server.js
   limits: { fileSize: 10 * 1024 * 1024 }  // 10MB limit
   ```

2. **Verify MIME type:**
   ```bash
   # File should be image type
   file test_image.jpg
   # Should output: image/jpeg
   ```

3. **Check upload directory:**
   ```bash
   mkdir -p backend/uploads
   chmod 755 backend/uploads
   ```

4. **Test upload directly:**
   ```bash
   curl -X POST -F "file=@image.jpg" http://localhost:3000/detect
   ```

---

#### AI Detection Not Working

**Symptoms:** 404 error from `/detect` endpoint, malformed response

**First check:**
```bash
# Is AI service running?
curl http://localhost:8000/health
```

**If AI service not running, see Python section below**

**If running but detection fails:**

1. **Check image file:**
   ```bash
   file test_image.jpg
   # Should be: image/jpeg
   ```

2. **Test detection endpoint:**
   ```bash
   curl -X POST -F "file=@test.jpg" http://localhost:8000/detect
   ```

3. **Check server logs:**
   ```bash
   # Look for error messages in backend terminal
   # May see "Failed to detect car"
   ```

---

### 🐍 AI Service (Python) Issues

#### Cannot Start Python Service

**Symptoms:** Command not found, module errors, port not listening

**Solutions:**

1. **Verify Python installation:**
   ```bash
   python --version        # Should be 3.8+
   python -m pip --version # Check pip works
   ```

2. **Fix virtual environment:**
   ```bash
   cd ai-service
   
   # Remove bad venv
   rm -rf venv
   
   # Create fresh venv
   python -m venv venv
   
   # Activate
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   
   # Install packages
   pip install -r requirements.txt
   ```

3. **Run with proper Python path:**
   ```bash
   # Find Python
   which python3
   
   # Use absolute path
   /usr/bin/python3 -m venv venv
   ```

---

#### Import Errors (ModuleNotFoundError)

**Symptoms:** 
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solutions:**

1. **Reinstall requirements:**
   ```bash
   cd ai-service
   source venv/bin/activate  # or venv\Scripts\activate
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

2. **Check requirements.txt:**
   ```bash
   cat requirements.txt
   # Should have: fastapi, uvicorn, Pillow, numpy
   ```

3. **Verify venv is active:**
   ```bash
   # Prompt should show (venv) prefix
   # If not, reactivate: source venv/bin/activate
   ```

---

#### Python Version Issues

**Symptoms:** Syntax errors, module compatibility issues

**Solutions:**

1. **Check Python version:**
   ```bash
   python --version  # Need 3.8+
   ```

2. **Use specific version:**
   ```bash
   python3.10 -m venv venv
   ```

3. **Update dependencies to compatible versions:**
   ```bash
   pip install fastapi==0.104.1 uvicorn==0.24.0
   ```

---

#### Uvicorn Port Already in Use

**Symptoms:**
```
OSError: [WinError 10048] Only one usage of each socket address
```

**Solutions:**

1. **Kill process on port 8000:**
   ```bash
   # Windows
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:8000 | xargs kill -9
   ```

2. **Use different port:**
   ```bash
   # Edit detect.py
   uvicorn.run(app, host="0.0.0.0", port=8001)
   
   # Update backend proxy
   app.post('/detect', async (req, res) => {
     axios.post('http://localhost:8001/detect', ...)
   })
   ```

---

### 🌐 Network & Connection Issues

#### Cannot Connect Between Services

**Symptoms:** 
```
Failed to fetch
ECONNREFUSED
Network Error
```

**Solutions:**

1. **Verify all services are running:**
   ```bash
   # Terminal 1: Frontend
   cd frontend && npm run dev
   
   # Terminal 2: Backend
   cd backend && npm start
   
   # Terminal 3: AI Service
   cd ai-service && python detect.py
   ```

2. **Test connectivity:**
   ```bash
   # Different terminal
   curl http://localhost:5173  # Frontend
   curl http://localhost:3000/health  # Backend
   curl http://localhost:8000/health  # AI
   ```

3. **Fix localhost vs 127.0.0.1:**
   ```javascript
   // vite.config.ts - use localhost
   proxy: {
     '/api': {
       target: 'http://localhost:3000',  // Not 127.0.0.1
   ```

4. **Check firewall:**
   ```bash
   # Windows Defender may block ports
   # Add exceptions for Node.js and Python
   ```

---

#### CORS Errors

**Symptoms:** 
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**

1. **Update backend CORS:**
   ```javascript
   // backend/server.js
   app.use(cors({
     origin: ['http://localhost:5173', 'http://localhost:3000'],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type']
   }))
   ```

2. **Fix proxy configuration:**
   ```typescript
   // frontend/vite.config.ts
   proxy: {
     '/api': {
       target: 'http://localhost:3000',
       changeOrigin: true,  // Important!
       rewrite: (path) => path.replace(/^\/api/, '')
     }
   }
   ```

3. **Test without CORS temporarily:**
   ```javascript
   // For debugging only
   app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*')
     next()
   })
   ```

---

### 📦 Dependency Issues

#### npm install fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clean npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

2. **Use legacy peer deps (temporary fix):**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Remove lock files:**
   ```bash
   rm package-lock.json
   npm install
   ```

4. **Update npm itself:**
   ```bash
   npm install -g npm@latest
   npm install
   ```

---

#### pip install fails

**Symptoms:**
```
ERROR: Could not find a version that satisfies the requirement
```

**Solutions:**

1. **Upgrade pip:**
   ```bash
   python -m pip install --upgrade pip
   ```

2. **Install from requirements.txt with pypa resolver:**
   ```bash
   pip install -r requirements.txt --use-deprecated=legacy-resolver
   ```

3. **Install packages individually:**
   ```bash
   pip install fastapi==0.104.1
   pip install uvicorn==0.24.0
   pip install Pillow==10.0.1
   pip install numpy==1.24.3
   ```

---

## Testing Endpoints

### Test Frontend API Connection

```javascript
// In browser console (http://localhost:5173)
fetch('/api/cars')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.error('Error:', e))
```

### Test Backend Directly

```bash
# Get all cars
curl http://localhost:3000/cars

# Get specific car
curl http://localhost:3000/cars/lamborghini_aventador_2012

# Get colors
curl http://localhost:3000/colors

# Health check
curl http://localhost:3000/health
```

### Test AI Service

```bash
# Health check
curl http://localhost:8000/health

# Test detection (requires image file)
curl -X POST -F "file=@image.jpg" http://localhost:8000/detect
```

---

## Debug Mode

### Enable Debug Logging

**Frontend:**
```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.data)
    return response
  },
  error => {
    console.error('API Error:', error)
    throw error
  }
)
```

**Backend:**
```javascript
// server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
```

**Python:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug("Detecting car from image...")
```

---

## Performance Diagnostics

### Frontend Performance

```javascript
// Browser DevTools - Performance tab
// 1. Click Record
// 2. Rotate 3D model
// 3. Click Stop
// 4. Analyze:
//    - Frame rate (should be 60 FPS)
//    - Main thread blocking
//    - Memory usage
```

### Network Performance

```javascript
// Browser DevTools - Network tab
// Check:
// - API response times (should be < 200ms)
// - Model file size
// - Total load time
```

### Backend Performance

```bash
# Monitor Node process
node --inspect server.js
# Open chrome://inspect in Chrome

# Check memory usage
ps aux | grep node
```

---

## Recovery Procedures

### Full Reset

```bash
# Stop all services
# Ctrl + C in all terminals

# Clean installs
cd frontend && rm -rf node_modules && npm install
cd backend && rm -rf node_modules && npm install
cd ai-service && rm -rf venv && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt

# Clear caches
npm cache clean --force
pip cache purge

# Start fresh
# Run run.bat or manual start
```

### Database Reset (if using MongoDB)

```bash
# Clear collections
db.cars.deleteMany({})
db.users.deleteMany({})

# Re-import JSON
db.cars.insertMany(JSON.parse(fs.readFileSync('./data/cars.json')))
```

---

## Still Not Working?

### Collect Diagnostic Information

Run this to save system info:

```bash
# Windows
systeminfo > diagnostic.txt
node --version >> diagnostic.txt
python --version >> diagnostic.txt
npm --version >> diagnostic.txt

# macOS/Linux
system_profiler > diagnostic.txt
node --version >> diagnostic.txt
python --version >> diagnostic.txt
npm --version >> diagnostic.txt
```

### Get Error Logs

```bash
# Capture all terminal output to file
# Frontend:
npm run dev > frontend.log 2>&1

# Backend:
npm start > backend.log 2>&1

# Python:
pythondetect.py > ai.log 2>&1

# Then share these logs for debugging
```

---

**Last Updated:** 2026-03-26
**For more help:** See TECHNICAL_DOCUMENTATION.md
