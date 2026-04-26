# Price Audit

**Price Audit** is an AI-powered SaaS platform designed to automate the extraction, auditing, and market-comparison of construction quotations. Built with a modern Next.js stack, it transforms dense, unstructured PDF and Excel files into clean, comparable data, saving hours of manual data entry.

## 🚀 Features

- **AI-Powered Extraction**: Upload PDF, XLSX, or CSV quotation files. The system utilizes OpenAI's advanced LLMs (via the KRouter proxy) to parse unstructured data into clean JSON schemas.
- **Smart Data Grouping**: Automatically categorizes items based on quotation headers (e.g., Electrical, Plumbing, Interior).
- **Market Price Intelligence**: Integrates with external search APIs to instantly find real-time market prices for comparison.
- **Interactive Dashboard**: A sleek, high-performance UI inspired by legacy desktop applications but built for the web. Includes:
  - Real-time subtotal calculators
  - Inline editing for negotiated prices
  - Visual savings indicators and "Overpriced" alerts
- **Persistent Storage**: Data is saved to a PostgreSQL database via Prisma ORM for reliable tracking.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (Neon / Vercel Postgres)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **File Parsing**: `pdf2json` & `xlsx`
- **AI Integration**: OpenAI SDK

## ⚙️ Local Development

### Prerequisites
- Node.js 18.x or higher
- A PostgreSQL database (or you can switch the Prisma provider back to `sqlite` for local testing)
- An AI API Key (OpenAI or compatible proxy like KRouter)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/markdo27/baogia.git
   cd baogia
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/db"

   # AI Extraction API
   OPENAI_API_KEY="your-api-key"
   OPENAI_BASE_URL="https://api.your-provider.com/v1"
   OPENAI_MODEL="gpt-4o"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment

This application is optimized for deployment on **Vercel**.

1. Import the project into Vercel.
2. Under **Project Settings > General**, ensure the Framework Preset is set to **Next.js**.
3. Add the environment variables (`DATABASE_URL`, `OPENAI_API_KEY`, etc.) in the Vercel dashboard.
4. The included `postinstall` script (`prisma generate`) will ensure the database client builds correctly during deployment.

---
*Built for speed, accuracy, and maximum negotiation leverage.*
