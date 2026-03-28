# Supabase Configuration

## Setup Steps

### 1. Create Supabase Account
- Go to https://supabase.com
- Sign up free account
- Create new project

### 2. Get API Keys
From Supabase dashboard:
- Project URL → `VITE_SUPABASE_URL`
- Anon Public Key → `VITE_SUPABASE_ANON_KEY`

### 3. Create .env.local
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run SQL Schema
Copy content from `backend/sql/schema.sql` into Supabase SQL editor and execute

### 5. Install Dependencies
```bash
cd frontend
npm install @supabase/supabase-js
```

---

## Database Schema

**profiles** table - User information
- id (UUID, from auth)
- email (text, unique)
- username (text, unique)
- avatar_url (text)
- created_at, updated_at

**customizations** table - Saved car customizations
- id (UUID)
- user_id (UUID, foreign key)
- name (text)
- data (JSONB) - contains car config
- car_id (text)
- created_at, updated_at

---

## Features Enabled

✅ User Authentication (via Supabase Auth)
✅ Save/Load Customizations
✅ Row Level Security (users only see own data)
✅ Real-time updates ready
✅ Cloud database (no local JSON files needed)

---

## Environment Variables

Create `.env.local` in frontend folder:
```
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

Get these from Supabase dashboard → Settings → API
