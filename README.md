# FestivalHub

Planning community festivals: groups, member contributions, expense tracking and a vendor marketplace.

| Folder | What it is |
|---|---|
| `src/` | The original web prototype (this README). Its data is still mock data in the page components. |
| `mobile/` | The Android app (Expo + React Native), which uses the Supabase backend. See [mobile/README.md](mobile/README.md). |
| `supabase/` | Database schema, access rules and tests, shared by both. |

## 🗄️ Backend (Supabase)

`supabase/migrations` defines the tables, row-level security and the functions the app calls; the vendor catalogue is also a migration, so every database gets it. There are no demo accounts or groups: sign up in the app.

```bash
npx supabase start     # local database + API in Docker; prints the URL and keys
npx supabase db reset  # reapply the schema
npx supabase test db   # run the access-control tests in supabase/tests
```

To use a hosted project instead: create one at [supabase.com](https://supabase.com), then `npx supabase link --project-ref <ref>` and `npx supabase db push`.

**Status:** the schema and vendor catalogue are live on a hosted Supabase project, and the mobile app runs against it. The access-control tests create their own accounts and group, but haven't run yet, because Docker Desktop won't start on this machine.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Lucide icons** - Only the icons registered in `src/components/AppIcon.jsx` are bundled

## 🔑 Sign-up and sign-in

Create an account at `/signup`, then sign in at `/login-registration` with its email (or phone) and password. There is no demo account.

Accounts and sessions are simulated in the browser (`src/utils/auth.js`): they are saved in this browser's local storage (passwords only as a hash), are not shared with the mobile app or Supabase, and are not real authentication.

The dashboard, group, finance and settings pages require sign-in; the marketplace is public.

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```