# 🔄 Update & Extension Guide - Car Customizer

Complete guide for updating, maintaining, and extending the Car Customizer application.

---

## Table of Contents

1. [Regular Maintenance](#regular-maintenance)
2. [Adding New Content](#adding-new-content)
3. [Feature Development](#feature-development)
4. [Fixing Bugs](#fixing-bugs)
5. [Performance Improvements](#performance-improvements)
6. [Dependency Updates](#dependency-updates)
7. [Deployment Updates](#deployment-updates)

---

## Regular Maintenance

### Weekly Tasks

- [ ] Review error logs
- [ ] Check disk space usage
- [ ] Monitor API endpoint performance
- [ ] Review user feedback

### Monthly Tasks

- [ ] Update dependencies (non-major)
- [ ] Test all customization combinations
- [ ] Verify backups working
- [ ] Check security updates available

### Quarterly Tasks

- [ ] Major dependency updates (with testing)
- [ ] Code review and refactoring
- [ ] Performance optimization audit
- [ ] Security audit

---

## Adding New Content

### Adding a New Car

#### Step 1: Prepare 3D Model

```bash
# In Blender or 3DS Max
1. Import/create car model
2. Set up materials and textures
3. Generate LODs (Level of Detail) for optimization:
   - High: Full detail (for close-up views)
   - Medium: 50% reduction
   - Low: 75% reduction
4. Export as GLB:
   - File → Export → glTF 2.0 (.glb)
   - Include animations: No
   - Include materials: Yes
   - Compression: Enabled
5. Optimize file size (should be 2-10 MB)
```

#### Step 2: Add to Data

Edit `data/cars.json`:

```json
{
  "id": "make_model_year",
  "make": "Brand Name",
  "model": "Model Name",
  "year": 2024,
  "trim": "Trim Level",
  "modelPath": "/models/make_model_year.glb",
  "baseColor": "#FFD700",
  "compatibleKits": ["liberty_walk", "mansory"],
  "compatibleWheels": ["adv1_19", "hre_19"],
  "compatibleLiveries": ["matte_black", "carbon_fiber"]
}
```

**Required fields:**
- `id`: Unique identifier (lowercase with underscores)
- `make`: Manufacturer name
- `model`: Model name
- `year`: Production year
- `modelPath`: Path to .glb file
- `baseColor`: Default color in hex

**Optional fields:**
- `trim`: Specific trim level
- `compatibleKits`: Array of compatible body kits
- `compatibleWheels`: Array of compatible wheels
- `compatibleLiveries`: Array of compatible paint schemes

#### Step 3: Test

```typescript
// Temporary test code in App.tsx
useEffect(() => {
  carService.getById('make_model_year')
    .then(car => {
      console.log('Car loaded:', car)
      setSelectedCar(car)
    })
    .catch(err => console.error('Car failed:', err))
}, [])
```

---

### Adding a New Body Kit

#### Step 1: Prepare Concept

Decide on:
- Kit name and ID
- Compatibility (which cars)
- Price point
- Key features (spoiler, diffuser, etc.)

#### Step 2: Add to Data

Edit `data/parts.json`:

```json
{
  "id": "new_kit_name",
  "name": "Display Name (e.g., Liberty Walk Kit V2)",
  "category": "body_kit",
  "description": "Short description of the kit",
  "price": 8500,
  "compatibility": ["lamborghini_aventador_2012", "nissan_skyline_r34"],
  "thumbnailUrl": "/images/kits/new_kit_name.jpg",
  "properties": {
    "spoiler": true,
    "diffuser": true,
    "side_skirts": true,
    "front_bumper": true,
    "carbon_fiber": false
  }
}
```

#### Step 3: Optional - Create Thumbnail

```bash
# Create 200x200px image
# Format: JPG or PNG
# Place in: frontend/public/images/kits/

# Ensure it looks good at small sizes
```

---

### Adding Wheels

Edit `data/parts.json`:

```json
{
  "id": "wheel_brand_size",
  "name": "Brand Size\" Wheels",
  "category": "wheels",
  "description": "Description of wheels",
  "price": 4500,
  "compatibility": ["car_id_1", "car_id_2"],
  "thumbnailUrl": "/images/wheels/wheel_brand_size.jpg",
  "properties": {
    "diameter": 19,
    "material": "forged_aluminum",
    "finish": "custom",
    "weight_kg": 9.5
  }
}
```

---

### Adding Colors

Edit `data/colors.json`:

```json
{
  "id": "color_name_lower",
  "name": "Color Name",
  "hexCode": "#FF5733",
  "metallic": true,  // true for metallic, false for matte
  "category": "premium",  // or "standard", "matte", "neon"
  "specialEffect": "color_shifting"  // optional
}
```

**Categories:**
- `premium`: Expensive/rare colors
- `standard`: Common colors
- `matte`: Matte finishes
- `neon`: Bright neon colors

---

### Adding Liveries (Paint Schemes)

Edit `data/liveries.json`:

```json
{
  "id": "livery_id",
  "name": "Livery Name",
  "type": "wrap",  // or "paint"
  "description": "Description",
  "primaryColor": "#000000",
  "secondaryColor": "#FFFFFF",
  "compatibleCars": ["car_id_1"],
  "textureUrl": "/textures/livery_name.png",
  "pattern": "racing_stripes"  // or "carbon_weave", "flames", etc.
}
```

---

## Feature Development

### Adding a New Customization Category

Example: Add "Exhaust Systems"

#### Step 1: Update Type Definitions

```typescript
// frontend/src/types/index.ts
export interface Customization {
  // ... existing
  exhaustSystem?: string
}
```

#### Step 2: Update Hook

```typescript
// frontend/src/hooks/useCarCustomization.ts
const setExhaustSystem = useCallback((systemId: string) => {
  setCustomization((prev) => ({
    ...prev,
    exhaustSystem: systemId === prev.exhaustSystem ? null : systemId,
  }))
}, [])

return {
  // ... existing
  setExhaustSystem,
}
```

#### Step 3: Update CustomizationPanel

```typescript
// frontend/src/components/CustomizationPanel.tsx
const [activeTab, setActiveTab] = useState<
  'kit' | 'wheels' | 'color' | 'livery' | 'exhaust'
>('kit')

// Add tab button
<button
  className={`tab-button ${activeTab === 'exhaust' ? 'active' : ''}`}
  onClick={() => setActiveTab('exhaust')}
>
  Exhaust
</button>

// Add content
{activeTab === 'exhaust' && (
  <div className="exhaust-list">
    {/* Similar to wheels/kits */}
  </div>
)}
```

#### Step 4: Add Data

Create `data/exhausts.json` or add to `parts.json` with `category: "exhaust_system"`

#### Step 5: Update API Service

```typescript
// frontend/src/services/api.ts
export const exhaustService = {
  getAll: async () => {
    const response = await api.get('/parts?category=exhaust_system')
    return response.data.data || []
  },
  // ...additional methods
}
```

#### Step 6: Update Backend

```javascript
// backend/server.js
app.get('/exhausts', (req, res) => {
  const exhausts = parts.filter(p => p.category === 'exhaust_system')
  sendResponse(res, exhausts)
})
```

#### Step 7: Test

```bash
# 1. Add test data
# 2. Load in UI
# 3. Verify parameter passing
# 4. Test selection/deselection
# 5. Verify export includes exhaust system
```

---

### Adding User Accounts & Persistence

#### Setup MongoDB

```bash
# Install MongoDB Compass (GUI)
# Or use MongoDB Atlas (cloud)

# In backend, install mongoose:
npm install mongoose bcryptjs jsonwebtoken
```

#### Create Auth Middleware

```javascript
// backend/middleware/auth.js
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

#### Add User Routes

```javascript
// backend/routes/auth.js
import express from 'express'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ email, password: hashedPassword })
  await user.save()
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
  res.json({ token })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.status(401).json({ error: 'Invalid password' })
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
  res.json({ token })
})

export default router
```

---

## Fixing Bugs

### Bug Report Template

When fixing bugs, document:

```markdown
## Bug: [Title]

### Description
What's the issue?

### Steps to Reproduce
1. ...
2. ...
3. ...

### Expected Behavior
What should happen?

### Actual Behavior
What's happening instead?

### Screenshots
[If applicable]

### System
- OS: Windows 11 / macOS / Linux
- Node: v18.0.0
- Python: 3.10.0

### Fix Applied
[What was changed]

### Testing
[How was it tested]
```

### Common Bug Fixes

#### Bug: 3D Model Rotates Wrong Direction

```typescript
// Viewer3D.tsx
- controls.autoRotation = true
+ controls.autoRotation = true
+ controls.autoRotateSpeed = -2  // Negative to reverse
```

#### Bug: Colors Not Saving

```typescript
// useCarCustomization.ts
// Ensure color is in correct format
const colorHex = color.startsWith('#') ? color : '#' + color
setPrimaryColor(colorHex)
```

#### Bug: File Upload Size Limit Not Working

```javascript
// server.js
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
- limits: { fileSize: 10 * 1024 * 1024 },
+ limits: { fileSize: 5 * 1024 * 1024 },  // Reduce to 5MB
})
```

---

## Performance Improvements

### Frontend Optimization

#### Lazy Load Components

```typescript
import { lazy, Suspense } from 'react'

const CustomizationPanel = lazy(() =>
  import('./components/CustomizationPanel')
)

// In App:
<Suspense fallback={<div>Loading...</div>}>
  <CustomizationPanel {...props} />
</Suspense>
```

#### Memoize Components

```typescript
const Viewer3D = React.memo(
  ({ modelPath, primaryColor }) => {
    // Only re-renders if props change
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return (
      prevProps.modelPath === nextProps.modelPath &&
      prevProps.primaryColor === nextProps.primaryColor
    )
  }
)
```

#### Image Optimization

```bash
# Install sharp for image optimization
npm install sharp

# Create optimization script
# scripts/optimize-images.js
```

```javascript
// scripts/optimize-images.js
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const imageDir = 'frontend/public/images'

fs.readdirSync(imageDir).forEach(file => {
  if (file.endsWith('.jpg')) {
    sharp(path.join(imageDir, file))
      .resize(200, 200, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(imageDir, file.replace('.jpg', '.webp')))
  }
})
```

### Backend Optimization

#### Add Caching

```javascript
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 600 })  // 10 minutes

app.get('/cars', (req, res) => {
  const cached = cache.get('all_cars')
  if (cached) return sendResponse(res, cached)
  
  const data = cars  // Load from JSON
  cache.set('all_cars', data)
  sendResponse(res, data)
})
```

#### Enable Compression

```javascript
import compression from 'compression'

app.use(compression())  // Compress responses
```

#### Implement Pagination

```javascript
app.get('/parts', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const start = (page - 1) * limit
  
  const paginated = parts.slice(start, start + limit)
  return sendResponse(res, {
    items: paginated,
    total: parts.length,
    page,
    pages: Math.ceil(parts.length / limit)
  })
})
```

---

## Dependency Updates

### Safe Update Process

```bash
# 1. Check for updates
npm outdated

# 2. Update patch versions (safe)
npm update

# 3. Check what's outdated
npm outdated

# 4. Test thoroughly
npm test
npm run dev

# 5. If needed, update minor versions
npm install three@latest

# 6. Always test after major updates
```

### Update Strategy by Severity

| Type | Frequency | Testing |
|------|-----------|---------|
| Patch (1.2.3 → 1.2.4) | Weekly | Quick |
| Minor (1.2.3 → 1.3.0) | Monthly | Medium |
| Major (1.2.3 → 2.0.0) | Quarterly | Extensive |

### Handling Breaking Changes

```bash
# Before updating
git checkout -b feature/update-three

# Update
npm install three@latest

# Fix breaking changes
npm run dev  # Check for errors

# Test features
npm run build

# Create pull request once tested
git push origin feature/update-three
```

---

## Deployment Updates

### Update Production Environment

#### Blue-Green Deployment

```bash
# Current (Blue)
pm2 start backend/server.js --name "car-customizer-blue"

# New (Green)
pm2 start backend/server.js --name "car-customizer-green" --port 3001

# Test Green
curl http://localhost:3001/health

# Switch traffic
# Update nginx/load balancer to point to Green

# Monitor for issues
pm2 logs car-customizer-green

# If successful, stop Blue
pm2 stop car-customizer-blue
pm2 delete car-customizer-blue

# If issues, switch back to Blue
```

#### Database Migrations

```bash
# Before deploying schema changes
# 1. Create migration file
# 2. Test on dev database
# 3. Backup production database
# 4. Run migration with rollback option
# 5. Deploy new code
# 6. Monitor for errors
```

### Rollback Procedure

```bash
# If deployment fails
git revert <commit-hash>
npm install  # Might need to reinstall
npm start    # Restart service

# For data issues
# Restore from backup
```

---

## Documentation Updates

When making changes:

1. **Update relevant docs:**
   - README.md (features)
   - TECHNICAL_DOCUMENTATION.md (architecture)
   - TROUBLESHOOTING.md (issues)
   - This file (extensions)

2. **Add code comments:**
   ```typescript
   // Complex logic should have comments
   // Explanation of why, not just what
   ```

3. **Update API documentation:**
   ```javascript
   /**
    * GET /cars/:id
    * @param {string} id - Car ID
    * @returns {Car} Car object
    */
   app.get('/cars/:id', (req, res) => {
     // ...
   })
   ```

---

## Version Management

### Semantic Versioning

Use format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Changelog

Create `CHANGELOG.md`:

```markdown
## [1.1.0] - 2026-04-01
### Added
- New suspension customization option
- User account system

### Fixed
- 3D model loading bug
- Color not persisting issue

### Changed
- Improved performance of car detection

## [1.0.0] - 2026-03-26
### Added
- Initial release
- Core customization features
```

---

## Continuous Integration Setup

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: cd frontend && npm install && npm run build
      - run: cd backend && npm install && npm test
```

---

**Last Updated:** 2026-03-26  
**For issues:** See TROUBLESHOOTING.md  
**For architecture:** See TECHNICAL_DOCUMENTATION.md
