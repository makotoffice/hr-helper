
# HR Pro Toolbox

A React-based toolbox for HR professionals, powered by AI.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (if available) or set your API keys:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## 📦 Deployment

This project is configured to deploy to **GitHub Pages** automatically using GitHub Actions.

1. Go to your repository **Settings** > **Pages**.
2. Under "Build and deployment", select **GitHub Actions** as the source.
3. Push your changes to the `main` branch.
4. The "Deploy to GitHub Pages" action will trigger and deploy your site.
