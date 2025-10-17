# Capitalia Web - Admin Authentication Setup

## 🚀 Quick Start

Your Next.js application with Supabase authentication is ready! Here's how to complete the setup:

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project in your Supabase dashboard

## 🔧 Environment Setup

1. **Get your Supabase credentials** from your project dashboard:
   - Go to Settings → API
   - Copy your Project URL and anon public key
   - Copy your service role key (keep this secret!)

2. **Create your environment file** by copying the example:
   ```bash
   cp .env.example .env.local
   ```

3. **Update your environment variables** in `.env.local`:
   ```env
   # Replace these with your actual Supabase project credentials
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   NEXT_PUBLIC_ADMIN_EMAIL=admin@capitalia.com
   ```

   **Important**: Replace all the placeholder values with your actual Supabase credentials!

## 👤 Admin User Setup

### Option 1: Create Admin User via Supabase Dashboard
1. Go to Authentication → Users in your Supabase dashboard
2. Click "Add user"
3. Set email to match `NEXT_PUBLIC_ADMIN_EMAIL` in your `.env.local`
4. Set a secure password
5. Click "Create user"

### Option 2: Create Admin User via SQL
Run this SQL in your Supabase SQL editor:
```sql
-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create admin user (replace with your admin email)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@capitalia.com',
  crypt('your_secure_password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## 🛡️ Security Features

- **Role-based Access Control**: Only users with the admin email can access admin routes
- **Middleware Protection**: Server-side route protection using Next.js middleware
- **Session Management**: Automatic session refresh and secure cookie handling
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx      # Admin login page
│   │   └── dashboard/page.tsx  # Protected admin dashboard
│   ├── unauthorized/page.tsx   # Unauthorized access page
│   ├── layout.tsx             # Root layout with AuthProvider
│   └── page.tsx               # Home page
├── components/
│   └── ProtectedRoute.tsx     # Route protection component
└── lib/
    ├── auth/
    │   └── AuthContext.tsx    # Authentication context
    └── supabase/
        ├── client.ts          # Client-side Supabase client
        ├── server.ts          # Server-side Supabase client
        └── types.ts           # TypeScript types
```

## 🚀 Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Authentication Flow

1. **Login**: Users can access `/admin/login` to sign in
2. **Middleware**: Routes are protected at the server level
3. **Context**: Authentication state is managed globally
4. **Dashboard**: Admin users can access `/admin/dashboard`
5. **Logout**: Users can sign out from the dashboard

## 🛠️ Customization

### Adding New Admin Features
1. Create new pages in `src/app/admin/`
2. Wrap them with `<ProtectedRoute requireAdmin={true}>`
3. Add navigation links in the dashboard

### Changing Admin Email
1. Update `NEXT_PUBLIC_ADMIN_EMAIL` in `.env.local`
2. Update the user email in Supabase or create a new admin user

### Styling
- Uses Tailwind CSS for styling
- Customize colors and layout in the component files
- Update the design system in `src/app/globals.css`

## 📝 Next Steps

1. **Set up your Supabase project** and update environment variables
2. **Create an admin user** using one of the methods above
3. **Test the authentication flow** by visiting `/admin/login`
4. **Customize the dashboard** with your admin features
5. **Deploy to production** using Vercel, Netlify, or your preferred platform

## 🔍 Troubleshooting

### Common Issues:
- **"Invalid login credentials"**: Check that the user exists in Supabase
- **"Unauthorized access"**: Verify the admin email matches your environment variable
- **Middleware errors**: Ensure all environment variables are set correctly

### Debug Mode:
Add `console.log` statements in your middleware or auth context to debug authentication issues.

---

🎉 **You're all set!** Your admin authentication system is ready to use.
