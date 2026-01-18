# 🚀 Installation Guide

Welcome to the **Resvo** installation guide. This comprehensive document will walk you through setting up your own instance of the most advanced restaurant reservation management system available. Whether you are a developer looking to contribute or a restaurant owner wanting to self-host, this guide is for you.

## 📋 Prerequisites

Before we begin, ensure you have the following installed on your machine:

1.  **Node.js**: Version 18.0.0 or higher is required. [Download Node.js](https://nodejs.org/)
2.  **npm** (Node Package Manager) or **yarn**: Usually comes with Node.js.
3.  **Git**: To clone the repository. [Download Git](https://git-scm.com/)
4.  **A Supabase Account**: We use Supabase for the database and authentication. [Sign up for free](https://supabase.com/)

---

## 🛠️ Step-by-Step Installation

### 1. Clone the Repository

First, you need to get the source code on your machine. Open your terminal and run:

```bash
git clone https://github.com/your-username/resvo-reservation-ops.git
cd resvo-reservation-ops
```

### 2. Install Dependencies

Install the necessary packages to run the application. We recommend using `npm`:

```bash
npm install
# or if you prefer yarn
yarn install
```

This might take a moment as it downloads Next.js, React, Tailwind CSS, and other powerful libraries that power Resvo.

### 3. Environment Configuration

The application needs to know how to connect to your database. We use environment variables for this.

1.  Duplicate the example environment file:
    ```bash
    cp .env.example .env.local
    ```
    *(Note: If `.env.example` doesn't exist, create a `.env.local` file manually)*

2.  Open `.env.local` in your text editor and populate it with your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

    You can find these in your Supabase Dashboard under **Project Settings > API**.

### 4. Database Setup

Resvo relies on a robust database structure. We have provided SQL scripts to automate this setup.

1.  Go to your Supabase Dashboard and open the **SQL Editor**.
2.  Navigate to the `database` folder in this repository.
3.  Copy and run the scripts in the following order:

    *   `01_schema.sql`: Sets up the tables for reservations, tables, invoices, etc.
    *   `02_rls_policies.sql`: Secures your data with Row Level Security policies.
    *   `03_triggers_functions.sql`: Adds automation magic for timestamps and updates.
    *   `04_seed_data.sql` (Optional): Populates your database with dummy data for testing.

**Tip:** You can check `database/README.md` for more detailed information about the schema.

### 5. Run the Application

Now comes the exciting part! Start the development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

🎉 **Congratulations!** You should now see the Resvo login screen.

---

## 🔧 Building for Production

If you want to deploy this for real-world usage, you should build the application:

```bash
npm run build
npm start
```

This creates an optimized version of the app ensuring blazing fast performance for your restaurant staff.

## 🆘 Troubleshooting

*   **Database Connection Error**: Double-check your `.env.local` file. Ensure there are no spaces around the `=` sign.
*   **Login Issues**: Make sure you have enabled "Email Provider" in Supabase Authentication settings.

Need more help? Open an issue on our GitHub repository!
