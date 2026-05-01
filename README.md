# Pramuka SMA Negeri 1 Pasawahan

Website Landing Page and Admin CMS (Content Management System) Dashboard for the Pramuka (Scout) organization of SMA Negeri 1 Pasawahan. This project displays member profiles, activities, galleries, and announcements, while providing a comprehensive and secure admin interface to manage content using Supabase as the backend.

## Key Features

- **Public Landing Page**: Fast, SEO-optimized, and server-side rendered website for public viewing.
- **Admin CMS Dashboard**: Comprehensive content management system for managing members, gallery, and activities.
- **Secure Authentication**: Built-in authentication powered by Supabase Auth with protected admin routes.
- **Interactive UI**: Fluid user experience with features like image pan-and-zoom, toast notifications, and advanced data tables.
- **Bilingual Support**: Internationalization (i18n) supporting both Indonesian (ID) and English (EN).
- **Modern Styling**: Fully responsive, accessible, and easily customizable design system.

---

## Tech Stack

- **Language**: TypeScript / Vue 3
- **Framework**: Nuxt 4 (Server-Side Rendering / Static Site Generation)
- **Frontend UI**: Tailwind CSS v4
- **UI Components**: Shadcn UI (`shadcn-nuxt`, `reka-ui`), Lucide Vue Next
- **Database / Auth**: Supabase (PostgreSQL, Authentication, Storage)
- **Data Table**: TanStack Table (`@tanstack/vue-table`)
- **Internationalization**: Nuxt i18n (`@nuxtjs/i18n`)
- **State & Utilities**: VueUse (`@vueuse/core`)
- **Deployment**: Node.js / Vercel

---

## Prerequisites

Ensure you have the following installed before setting up the project:

- Node.js 18 or higher (Node.js 20+ recommended)
- pnpm (recommended) or npm
- A Supabase Project (for PostgreSQL database, Auth, and Storage)
- (Optional) Cloudinary account for external image hosting

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nuxt-app.git
cd nuxt-app
```

### 2. Install Dependencies

It is highly recommended to use `pnpm`:

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory based on the environment variables needed by Nuxt and Supabase:

```bash
touch .env
```

Add your specific configuration details (refer to the Environment Variables section below). At a minimum, you must define:

```env
BASE_URL=http://localhost:3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

### 4. Start Development Server

Start the Nuxt dev server with hot-module replacement (HMR):

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architecture

### Directory Structure

```
├── app/
│   ├── assets/        # Global CSS and static resources
│   ├── components/    # Reusable Vue components (UI, Admin, Public)
│   ├── composables/   # Vue 3 composables (state management, logic)
│   ├── layouts/       # Nuxt page layouts (e.g., default, admin)
│   ├── lib/           # Utility functions
│   ├── middleware/    # Nuxt route middleware (e.g., auth guards)
│   ├── pages/         # File-based routing (pages/views)
│   ├── plugins/       # Nuxt plugins
│   └── services/      # External API/Backend integration wrappers
├── server/
│   ├── api/           # Nitro server API routes
│   ├── middleware/    # Server-side middleware
│   └── utils/         # Server utilities
├── i18n/              # Language translation files
├── public/            # Static assets (favicons, robots.txt)
├── nuxt.config.ts     # Nuxt configuration file
└── package.json       # Project dependencies and scripts
```

### Request Lifecycle

1. **Client Request**: A user visits a URL. The Nuxt router resolves the corresponding page component in `app/pages/`.
2. **Server-Side Rendering (SSR)**: For initial page loads or server-rendered pages, Nuxt executes `useAsyncData` or `useFetch` to gather required data before sending the HTML to the browser.
3. **API Processing**: If the frontend requests a `/api/...` endpoint, the Nitro server (`server/api/`) processes the business logic (e.g., validating JWT, fetching from Supabase), and returns JSON.
4. **Database Interaction**: The Nitro server or Supabase SDK interacts with the PostgreSQL database.
5. **Client Hydration**: Once the browser receives the HTML, Vue takes over and the page becomes interactive (SPA navigation for subsequent clicks).

### Data Flow

```
User Action → Vue Component → Nuxt Server Route / Supabase SDK → PostgreSQL Database
     ↓
Vue Reactive State ← API Response ←
```

### Key Components

**Authentication**
- Supabase Auth manages user sessions and JWT tokens.
- Nuxt route middleware (`app/middleware/`) checks session validity before allowing access to `/admin` routes.

**Database & Backend**
- Supabase provides a fully managed PostgreSQL database.
- Nitro server API routes handle sensitive operations like email sending (via Nodemailer) or secure profile updates, hiding credentials from the frontend.

**UI System**
- **Shadcn Vue** provides accessible, easily customizable components found in `app/components/ui/`.
- **Tailwind CSS v4** handles all utility classes and responsive design.
- **TanStack Table** handles complex data grid rendering, pagination, and sorting in the Admin CMS.

---

## Environment Variables

### Required

| Variable | Description | How to Get |
| --- | --- | --- |
| `BASE_URL` | Application base URL | Set to `http://localhost:3000` for dev |
| `SUPABASE_URL` | Supabase project URL | Supabase Dashboard > Project Settings > API |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | Supabase Dashboard > Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY`| Supabase service role key | Supabase Dashboard > Project Settings > API |
| `JWT_SECRET` | Secret used to sign JWTs | Custom string or Supabase JWT secret |

### Optional / SMTP Configuration

| Variable | Description | Example |
| --- | --- | --- |
| `EMAIL_SMTP_HOST` | Mail server hostname | `smtp.gmail.com` |
| `EMAIL_SMTP_PORT` | Mail server port | `465` or `587` |
| `EMAIL_SMTP_USER` | SMTP username / email address | `admin@example.com` |
| `EMAIL_SMTP_PASS` | SMTP password / App password | `your-password` |
| `EMAIL_SMTP_SECURE`| Use secure connection (SSL/TLS) | `true` |

---

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build application for production |
| `pnpm preview` | Locally preview the production build |
| `pnpm generate` | Pre-render every route as a static site (SSG) |
| `pnpm postinstall` | Run Nuxt prepare (auto-generates types) |

---

## Testing

Currently, no formal testing suite (like Vitest or Jest) is configured for this project.

To add tests in the future, you can configure Vitest and the Nuxt test utilities:

```bash
pnpm add -D vitest @nuxt/test-utils
```

### Example Test (Once Configured)

```typescript
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('My App', async () => {
  await setup({
    server: true
  })

  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Pramuka SMA Negeri 1 Pasawahan')
  })
})
```

---

## Deployment

This Nuxt 4 project can be deployed easily to modern edge providers or traditional Node.js servers.

### Vercel (Recommended)

Vercel provides native, zero-configuration support for Nuxt.

1. Push your code to a GitHub/GitLab repository.
2. Import the project in the Vercel dashboard.
3. Vercel will automatically detect Nuxt and set the correct build commands (`nuxt build`).
4. Add your Environment Variables in the Vercel dashboard.
5. Click **Deploy**.

### Node.js Server / Docker

To deploy on a standard VPS or using Docker:

1. Build the application:
```bash
pnpm build
```

2. The output will be in `.output/`. You can run the server via Node:
```bash
node .output/server/index.mjs
```

**Docker Example (`Dockerfile`):**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy source
COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
```

---

## Troubleshooting

### Supabase Connection Issues

**Error:** `FetchError: [GET] "https://<project>.supabase.co/...": fetch failed`
**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `.env` are completely accurate without trailing slashes.
2. Ensure your Supabase project hasn't been paused due to inactivity.

### Blank Page or Internal Server Error on Dev Server

**Solution:**
Sometimes the Nuxt cache gets corrupted.
```bash
# Clear Nuxt build cache and lockfiles
rm -rf .nuxt .output
pnpm dev
```

### Missing Shadcn UI Component Styles

**Error:** Component renders but has no styling or looks broken.
**Solution:**
Verify that your `tailwind.css` includes the correct Tailwind v4 directives and the Shadcn component directory is correctly specified in `nuxt.config.ts`. Run `pnpm dev` again to let Tailwind/Vite re-scan the files.
