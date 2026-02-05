# NewBank Frontend

A React + Vite + Tailwind CSS frontend for the NewBank banking application.

## Setup

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## API Proxy

The dev server proxies API requests to `http://localhost:8080`. 

When making requests from the frontend:
```javascript
// This will be proxied to http://localhost:8080/api/home/login
fetch('/api/home/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
})
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx        # Main app component
│   ├── main.jsx       # Entry point
│   └── index.css      # Global styles with Tailwind
├── public/            # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** 
- **PostCSS** - CSS transformation

## Notes

- Tailwind CSS is configured for `src/**/*.{js,jsx}` files
- API proxy is set to backend at `http://localhost:8080`
- To run backend refer repository NewBank in my profile.
- Make sure your Spring Boot backend is running on port 8080
