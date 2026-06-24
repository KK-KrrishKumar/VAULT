# Vault: Proactive Market Watch & Compliance Alert Terminal
*Developed by **KRRISH KUMAR***

**Vault** is an AI-inspired, high-fidelity real-time capital markets terminal and regulatory compliance workspace designed specifically for financial analysts, portfolio managers, and compliance officers operating under relentless, time-critical deadlines. 

When exchange filings, corporate notices, or earnings disclosures release in the final minutes before the market bell, **Vault** acts as the ultimate life-saver. It automatically digests complex corporate data, prioritizes high-impact events, computes standalone financial metrics, and creates rapid-action checklists to prevent costly oversights.

---

## 🚀 Key Integrations & Features

Vault bridges the gap between raw, unstructured corporate filings and instant, actionable compliance workflows through the following comprehensive systems:

1. **Live Indian & Global Market Watch (NSE, BSE, Global Indices)**: 
   * Active real-time streaming data of leading Indian stock indices: **NIFTY 50, SENSEX, NIFTY BANK**.
   * Global stock indices integration: **S&P 500, NASDAQ, FTSE 100**.
   * Commodity telemetry trackers: **Gold, Silver, Crude Oil**.
   * Data retrieved dynamically via high-efficiency Yahoo Finance market API proxies.

2. **Yahoo Finance Stock Search & Real-Time Price Engine**:
   * Instantly query and find real Indian stock tickers (e.g., `RELIANCE.NS`, `TATAMOTORS.NS`, `TCS.NS`) listed on the National Stock Exchange of India (NSE).
   * Live financial indicators, metrics, and percent changes rendered with visual sub-second responsive counters.
   * Direct Yahoo Search API matching that maps conversational names (like "Reliance" or "Tata") to official exchange tickers.

3. **Regulatory News Hub & SEBI Compliance Scanner**:
   * Pulls real-time financial articles and news updates powered by real-time Yahoo Finance News indices.
   * Tracks and parses regulatory draft modifications, warning signs, and official alerts under SEBI (Securities and Exchange Board of India) LODR requirements.


---

## 🛠️ Complete Technology Stack

* **Frontend Framework**: React 18+ with Vite (blazing-fast asset compiling and low latency).
* **Styling & Theme**: Tailwind CSS (custom modern light theme, slate cards, bold emerald highlight states, clean typography).
* **AI Model Engine**: **Google Gemini API** (`@google/genai` TypeScript SDK) running server-side to generate structured JSON templates, compliance checklists, and summarize announcements.
* **Database & Auth**: **Firebase (Firestore & Authentication)** for durable data sync, maintaining user watchlists, and secure analyst profiles.
* **Animations**: **Framer Motion** for visual dial rotation physics, layout transitions, and fluid state changes.
* **Vector Graphics**: Lucide React high-contrast icons for stock activity and regulatory statuses.

---

## 📋 Project Structure & Entry Points

* `/server.ts`: The core backend application. Proxies all Yahoo Finance quote feeds, historical price trend sheets, and real-time news streams, preventing CORS issues.
* `/src/App.tsx`: The master dashboard containing grid arrangements, stock charts, state managers, and visual synchronization hooks.
* `/src/components/`:
  * `AlertsStream.tsx`: Regulatory feed scanner and compliance alert dispatcher.
  * `InteractiveVault.tsx`: Immersive steel dial component with drag-to-rotate physics.
  * `LiveNewsHub.tsx`: Live stock news search and AI summarizing cards.
  * `ScreenerSection.tsx`: Interactive bento-grid screener showing current market trends.
  * `AuthCard.tsx`: Secure Firebase user credentials card.

---

## ⚡ How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Keys
Create a `.env` file at the root:
```env
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
```

### 3. Run the Development Server
```bash
npm run dev
```
The server will start on port `3000`. Open `http://localhost:3000` to interact with the system.

### 4. Build for Production
```bash
npm run build
npm start
```

---
*This high-performance terminal was designed and implemented by **KRRISH KUMAR**.*
