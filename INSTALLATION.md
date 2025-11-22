# Installation Guide

This guide will help you set up and run the Web3 Message Signer & Verifier application in a monorepo structure.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- A **Dynamic.xyz account** and Environment ID
  - Sign up at [Dynamic.xyz](https://www.dynamic.xyz/)
  - Create a new project
  - Get your Environment ID from the dashboard

## 🚀 Step-by-Step Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd legacy-fe-candidate-assignment
```

### Step 2: Install Dependencies

This project uses **npm workspaces** (monorepo). Install all dependencies from the root directory:

```bash
npm install
```

This command will automatically install dependencies for:
- Root workspace (concurrently for running both apps)
- Frontend workspace (`apps/fe`)
- Backend workspace (`apps/be`)

**Note**: You don't need to `cd` into individual workspaces to install dependencies. The root `npm install` handles everything.

### Step 3: Configure Environment Variables

#### Frontend Environment Variables

Create a `.env` file in the `apps/fe/` directory:

```bash
cd apps/fe
cp .env.example .env  # If .env.example exists
# Or create .env manually
```

Edit `apps/fe/.env` and add your configuration:

```env
# Dynamic.xyz Configuration
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here

# API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

**Important**: Replace `your_dynamic_environment_id_here` with your actual Dynamic.xyz Environment ID.

#### Backend Environment Variables

Create a `.env` file in the `apps/be/` directory:

```bash
cd apps/be
cp .env.example .env  # If .env.example exists
# Or create .env manually
```

Edit `apps/be/.env` and add your configuration:

```env
# Server Configuration
PORT=3000

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Note**: The default values should work for local development. Adjust if needed.

### Step 4: Configure Dynamic.xyz Allowed Origins

To avoid CORS errors, you must add your domain to Dynamic.xyz's allowed origins:

1. Go to [Dynamic.xyz Dashboard](https://app.dynamic.xyz/)
2. Select your project
3. Navigate to **Settings** → **Security** (or **Allowed Origins**)
4. Add the following origins:
   - `http://localhost:3000` (for local development)
   - Your production domain (if deploying)

5. Save the changes

**Note**: Changes may take a few minutes to propagate.

### Step 5: Run the Application

#### Option A: Run Both Services Together (Recommended)

From the root directory:

```bash
npm run dev
```

This will start both frontend and backend concurrently:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000 (API routes)

The output will show logs from both services with color coding.

#### Option B: Run Services Separately

If you prefer to run services in separate terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev --workspace fe
```

**Terminal 2 - Backend:**
```bash
npm run dev --workspace be
```

Or using the workspace directory directly:

**Terminal 1 - Frontend:**
```bash
cd apps/fe
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd apps/be
npm run dev
```

### Step 6: Verify Installation

1. **Check Frontend**: Open http://localhost:3000 in your browser
   - You should see the login page

2. **Check Backend**: Open http://localhost:3000/health in your browser
   - You should see: `{"status":"ok","timestamp":"..."}`

3. **Test Authentication**:
   - Enter your email on the login page
   - Check your email for the verification code
   - Enter the code to complete authentication

## 🧪 Testing the Installation

### Run All Tests

From the root directory:

```bash
npm run test
```

### Run Tests for Specific Workspace

**Frontend tests:**
```bash
npm run test --workspace fe
```

**Backend tests:**
```bash
npm run test --workspace be
```

## 🛠️ Building for Production

### Build All Workspaces

From the root directory:

```bash
npm run build
```

### Build Individual Workspaces

**Frontend:**
```bash
npm run build --workspace fe
```

**Backend:**
```bash
npm run build --workspace be
```

The built files will be in:
- Frontend: `apps/fe/dist/`
- Backend: `apps/be/dist/`

## 🔧 Troubleshooting

### Issue: CORS Errors

**Symptom**: `Access to fetch at 'https://app.dynamicauth.com/...' has been blocked by CORS policy`

**Solution**: 
1. Make sure you've added your domain to Dynamic.xyz's allowed origins (Step 4)
2. Wait a few minutes for changes to propagate
3. Clear your browser cache and try again

### Issue: "Environment ID not set" Warning

**Symptom**: Console warning about `VITE_DYNAMIC_ENVIRONMENT_ID`

**Solution**:
1. Check that `apps/fe/.env` exists
2. Verify `VITE_DYNAMIC_ENVIRONMENT_ID` is set correctly
3. Restart the dev server after creating/updating `.env`

### Issue: Port Already in Use

**Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
1. Change the port in `apps/fe/.env` or `apps/be/.env`
2. Or stop the process using port 3000:
   ```bash
   # Find process using port 3000
   lsof -ti:3000
   # Kill the process (replace PID with actual process ID)
   kill -9 <PID>
   ```

### Issue: Dependencies Not Installing

**Symptom**: Errors during `npm install`

**Solution**:
1. Delete `node_modules` and `package-lock.json` from root
2. Delete `node_modules` from `apps/fe` and `apps/be`
3. Run `npm install` again from root
4. If issues persist, try `npm cache clean --force`

### Issue: Module Not Found Errors

**Symptom**: `Cannot find module '@dynamic-labs/...'` or similar

**Solution**:
1. Make sure you ran `npm install` from the root directory
2. Check that the package exists in `apps/fe/package.json` or `apps/be/package.json`
3. Try deleting `node_modules` and reinstalling

## 📝 Environment Variables Reference

### Frontend (`apps/fe/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_DYNAMIC_ENVIRONMENT_ID` | Your Dynamic.xyz Environment ID | Yes | - |
| `VITE_API_BASE_URL` | Backend API base URL | No | `http://localhost:3000` |

### Backend (`apps/be/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3000` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |

## 🎯 Next Steps

After successful installation:

1. **Test Authentication**: Try logging in with your email
2. **Test Message Signing**: Sign a test message
3. **Check Message History**: Verify messages are stored in localStorage
4. **Review Code**: Explore the codebase structure

## 📚 Additional Resources

- [Dynamic.xyz Documentation](https://docs.dynamic.xyz/)
- [NPM Workspaces Documentation](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [Vite Documentation](https://vite.dev/)
- [Express.js Documentation](https://expressjs.com/)

## 💡 Tips

- Use `npm run dev` from root to run both services with colored output
- Check browser console for any runtime errors
- Use network tab in browser devtools to debug API calls
- Backend logs will show in the terminal where you ran `npm run dev`
