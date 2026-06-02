# Demo Prompt: Build a Field Technician App from Scratch

Use this prompt with GitHub Copilot after running `rayfin init` to scaffold a new project.

---

## The Prompt

Build a field technician management app using React, Rayfin, Radix UI, and Tailwind CSS. This app helps dispatchers create and assign service jobs to field technicians, who then execute them on-site.

### Data Model

Create these Rayfin entities in `rayfin/data/`:

1. **UserProfile** — `user_id` (uuid, unique — maps to the auth user's ID), `displayName` (text), `phone` (text, optional), `role` (set: 'technician' | 'dispatcher'). All fields readable/writable by authenticated users.

2. **Region** — `name` (text), `description` (text, optional).

3. **UserRegion** — Junction table linking UserProfile ↔ Region (one-to-one refs to each).

4. **Customer** — `name` (text), `phone` (text), `email` (email, optional), `address` (text, optional).

5. **Job** — `title` (text), `description` (text, optional), `status` (set: 'new' | 'scheduled' | 'investigating' | 'in-progress' | 'blocked' | 'complete' | 'abandoned'), `scheduledAt` (date, optional), `completedAt` (date, optional), `createdAt` (date), `updatedAt` (date), `isOnSite` (boolean, default false), `needsHelp` (boolean, default false), `helpDescription` (text, optional). Relationships: `customer` → Customer, `region` → Region, `technician` → UserProfile (optional), `createdBy` → UserProfile.

6. **Equipment** — `name` (text), `serialNumber` (text, optional), `notes` (text, optional). Relationship: `job` → Job.

7. **TaskItem** — `description` (text), `isComplete` (boolean, default false), `sortOrder` (int). Relationship: `job` → Job.

8. **JobLog** — `type` (set: 'note' | 'status_change' | 'assignment' | 'help_request'), `message` (text), `imageUrl` (text, optional), `actor_id` (text), `createdAt` (date). Relationship: `job` → Job.

All entities should use `@role('authenticated', '*')` for access control (any authenticated user can read/write).

### Authentication

Enable both password auth and Fabric auth in `rayfin.yml`. Build a dual-mode auth page:
- Show email/password sign-in and sign-up forms for local development
- Show a "Sign in with Fabric" button when Fabric environment variables are configured
- Use an `AuthContext` provider with `useAuth()` hook exposing: `user`, `loading`, `signIn`, `signUp`, `signOut`, `signInWithFabric`, `isAuthenticated`

### Service Layer

Create service interfaces and implementations in `src/services/`:

- **ServiceContainer** — Singleton that initializes the RayfinClient and provides all services. Read API URL and publishable key from Vite env vars.
- **IAuthService** — Wraps Rayfin auth with `signIn`, `signUp`, `signOut`, `getCurrentUser`, `isAuthenticated`, plus Fabric auth methods.
- **IUserProfileService** — `getMyProfile()`, `getProfilesByRole(role)`, `createProfile(data)`, `updateProfile(id, data)`.
- **IRegionService** — `getRegions()`, `createRegion(name)`, `getMyRegions()`, `assignRegion(regionId)`.
- **ICustomerService** — `searchByPhone(phone)`, `getAllCustomers()`, `createCustomer(data)`, `getCustomer(id)`.
- **IJobService** — Full CRUD plus: `getJobsForTechnician(techId)`, `getUnscheduledJobs()`, `getInProgressJobs()`, `getOverdueJobs()`, `getHelpRequestJobs()`, `updateJobStatus()`, `scheduleJob()`, `assignTechnician()`, `setOnSite()`, `requestHelp()`, `clearHelpRequest()`. Also manages sub-resources: equipment CRUD, task item CRUD (with toggle), and job log creation/listing.

### Pages & Routing

Use React Router v7. Wrap authenticated routes in a `ProtectedRoute` component.

1. **`/auth`** — Sign-in/sign-up page (public). Redirects to `/` if already authenticated.
2. **`/auth/callback`** — Fabric OAuth callback handler.
3. **`/`** — Role-based redirect: technicians → `/technician`, dispatchers → `/dispatcher`, no profile → `/profile-setup`.
4. **`/profile-setup`** — Two-step onboarding: Step 1 picks name, phone, and role (technician or dispatcher). Step 2 selects or creates a region assignment.
5. **`/technician`** — Dashboard showing the technician's assigned jobs in three sections: Scheduled (sorted by date), Unscheduled, and Completed. Auto-polls every 30 seconds.
6. **`/technician/jobs/:id`** — Job detail page with status updates, scheduling, on-site toggle, equipment list, task checklist, job logs with camera capture, and help request functionality.
7. **`/dispatcher`** — Dashboard with a 2×2 grid of job queues: Help Requests (amber), Overdue (red), Unscheduled, and In Progress. Includes "New Job" and "Customers" navigation buttons. Auto-polls every 30 seconds.
8. **`/dispatcher/jobs/new`** — Create job form: customer lookup by phone (or create new), region/technician selection, title, description, optional scheduling.
9. **`/dispatcher/jobs/:id`** — Same job detail page as technician view.
10. **`/dispatcher/customers`** — Customer search by phone and create new customer.
11. **`/admin`** — Admin page with tabs for managing data and seeding fake test data (customers, jobs, regions).

### Custom Hooks

- **`useUserProfile`** — Fetches current user's profile, provides `createProfile()` and `refresh()`.
- **`useTechnicianJobs`** — Fetches jobs for a technician with 30-second auto-polling.
- **`useDispatcherJobs`** — Fetches four parallel job lists (unscheduled, inProgress, overdue, helpRequests) with 30-second polling.
- **`useJobDetail`** — Loads a job with all relationships (customer, equipment, tasks, logs) and provides mutation methods for status, scheduling, on-site, help, equipment, tasks, and logs.
- **`useRegions`** — Fetches all regions and user's assigned regions, provides `createRegion()` and `assignRegion()`.

### UI Requirements

- Use Radix UI primitives (Dialog, Tabs, Select, Checkbox, etc.) with Tailwind CSS for styling.
- Camera capture component using `navigator.mediaDevices.getUserMedia()` with rear-facing camera preference for job log photos.
- Responsive layout that works on mobile (technicians use phones in the field).
- Toast notifications for success/error feedback using Sonner.
- Loading states and error boundaries throughout.

### Rayfin Configuration (`rayfin.yml`)

```yaml
services:
  auth:
    enabled: true
    fabric:
      enabled: true
    password:
      enabled: true
    allowedRedirectUris:
      - http://localhost:5173
      - http://localhost:5173/auth/callback
  data:
    enabled: true
    dialect: mssql
  storage:
    enabled: true
  staticHosting:
    enabled: true
    folder: dist
    buildCommand: npm run build
    indexDocument: index.html
```
