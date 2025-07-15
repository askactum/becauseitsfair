# ACTUM Website

This is the official ACTUM website, built with React, TypeScript, and Vite. It features a community laboratory, team pages, donation and shop functionality, and more.

## Features
- Modern React + TypeScript + Vite stack
- Community Lab with posts, comments, and monthly prompts
- Supabase for authentication, database, and real-time features
- Responsive design for desktop and mobile
- Admin features for moderation and prompt management

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase](https://supabase.com/) project (see below)

### Setup
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Supabase:**
   - Create a project on [Supabase](https://supabase.com/).
   - Copy your Supabase project URL and anon/public key.
   - Create a `.env` file in the root directory and add:
     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - The app expects tables for `profiles`, `posts`, `comments`, `monthly_prompt`, and related vote tables. See `/src/supabaseClient.ts` for how Supabase is initialized.

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The site will be available at [http://localhost:5173](http://localhost:5173).

## Supabase Usage
- **Authentication:** User sign up, login, and session management.
- **Database:** All posts, comments, profiles, and votes are stored in Supabase tables.
- **Admin:** Tag a profile as admin (see below) for moderation and prompt management.

### Making a User an Admin
Add an `is_admin` boolean column to the `profiles` table (if not present):
```sql
ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
```
Set a user as admin:
```sql
UPDATE profiles SET is_admin = true WHERE id = 'USER_ID_HERE';
```

## Contributing
- Please open issues or pull requests for bugs, features, or improvements.
- Follow the existing code style and structure.
- For Supabase schema changes, document your SQL in the PR.

## License
MIT (or your project license)
