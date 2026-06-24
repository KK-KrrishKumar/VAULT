# Vault: Proactive Market Watch & Compliance Alert Terminal

**Vault** is an AI-inspired, high-fidelity real-time capital markets terminal and regulatory compliance workspace designed specifically for financial analysts, portfolio managers, and compliance officers operating under relentless, time-critical deadlines. 

When exchange filings, corporate notices, or earnings disclosures release in the final minutes before the market bell, **Vault** acts as the ultimate life-saver. It automatically digests complex corporate data, prioritizes high-impact events, computes standalone financial metrics, and creates rapid-action checklists to prevent costly oversights.

---

## 🚀 What the Project Does

Vault bridges the gap between raw, unstructured corporate filings and instant, actionable compliance workflows :

1. **Live Indian & Global Market Watch**: Streams live data for core Indian indices (**NIFTY 50, SENSEX, NIFTY BANK**), global markets (**S&P 500, NASDAQ, FTSE 100**), and key commodities (**Gold, Silver, Crude Oil**) using high-frequency live proxy channels.
2. **Real-time Stock Search & Watchlist Tracking**: Allows users to dynamically search and monitor real Indian stock tickers (e.g., RELIANCE, TATAMOTORS, TCS) with live prices fetched directly from real-time market API proxies.
3. **Corporate News Hub **: Extracts the latest public news, SEBI regulatory changes, or corporate events for any tracked asset

---

## 🛠️ Key Technologies Used

* **Frontend**: React 18+, Vite (high-performance asset compilation), Tailwind CSS (pristine typography, responsive bento-grid layouts), Motion by Framer (smooth transition physics and dial rotation).
* **Backend**: Express & Node.js (high-performance server running on Cloud Run), Yahoo Finance query proxies (to retrieve official quotes, history, and news without heavy payload overhead).
* **State & Persistence**: Firebase (Firestore & Auth integration) for managing subscriber profiles and watchlists across devices.
* **Typographic Details**: Styled with a sophisticated, light high-contrast layout using the elegant "Inter" typeface paired with "JetBrains Mono" for technical telemetry grids.

---

## 📋 Project Structure & Entry Points

* `/server.ts`: The primary server application. Houses Express API routes proxying stock quote details, historical prices, and news, alongside the automated WhatsApp chatbot logic.
* `/src/App.tsx`: The primary frontend entry point. Contains the dashboard layout, responsive panels, simulated charts, and global state synchronizers.
* `/src/components/`: Modular UI units:
  * `AlertsStream.tsx`: Manages immediate, high-priority regulatory alert channels.
  * `InteractiveVault.tsx`: Represents the mechanical locking/unlocking dial.
  * `LiveNewsHub.tsx`: Displays stock news and summaries.
  * `ScreenerSection.tsx`: Houses metric-based analytical filters.
  * `AuthCard.tsx`: Integrates secure login screens.

---

## ⚡ How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The server will start on port `3000`. You can access it at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
npm start
```
