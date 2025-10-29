# CareerCraft (MERN)

## Run locally

Next.js app only.

- Create `.env.local` with:
  - MONGODB_URI=mongodb+srv://...

- Install deps and run:
  - npm install
  - npm run dev

Open http://localhost:3000

## API routes
- GET/PUT `/api/users/[email]` — get/update profile (name, avatarUrl, skills, resumePath, profile fields)
- PUT `/api/users/[email]/skills` — replace skills array
- POST `/api/users/[email]/resume` — upload resume PDF (multipart/form-data `file`)
