# BitPulse ⚡

BitPulse is a modern Cryptocurrency Dashboard and Wallet application built with React and Vite. It provides real-time price tracking, interactive candlestick charts, and Web3 wallet integration for seamless crypto transactions.

## 🚀 Features

- **Real-time Price Tracking**: Live price updates for major cryptocurrencies (BTC, ETH, SOL, XRP, DOGE).
- **Multi-Source Data Aggregation**: Robust price fetching with automatic fallbacks (CoinGecko -> CoinCap -> Binance).
- **Interactive Charts**: OHLC (Open, High, Low, Close) candlestick charts powered by ApexCharts and Binance API.
- **Web3 Wallet Integration**: Connect your wallet using Web3Modal and Wagmi.
- **Crypto Transactions**: Send ETH directly from the dashboard.
- **Modern UI**: Clean, dark-themed interface designed for optimal user experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: CSS3, Responsive Design
- **Charts**: [ApexCharts](https://apexcharts.com/), [Recharts](https://recharts.org/)
- **Web3**: [Wagmi](https://wagmi.sh/), [Web3Modal](https://web3modal.com/), [Viem](https://viem.sh/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)

### Backend (Proxy Server)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Utilities**: `node-fetch`, `cors`, `cheerio`

## 📦 Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites
- Node.js installed (v16+ recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd bitpulse
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Backend Server
The backend server acts as a proxy to fetch data from external APIs (CoinGecko, Binance, etc.) and handles CORS.

```bash
node server.js
```
*The server will start on `http://localhost:3001`*

### 4. Start the Frontend Application
Open a new terminal window and run:

```bash
npm run dev
```
*The application will be available at `http://localhost:5173` (or the port shown in your terminal)*

## 📂 Project Structure

```
bitpulse/
├── public/              # Static assets
├── src/
│   ├── assets/          # Component assets
│   ├── App.jsx          # Main application component
│   ├── WalletDashboard.jsx # Wallet connection wrapper
│   ├── TransactionPage.jsx # Transaction interface
│   └── main.jsx         # Entry point
├── server.js            # Express proxy server for API data
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🔌 API Endpoints (Local Backend)

The local Express server (`server.js`) exposes the following endpoints:

- **GET `/price/:symbol`**: Fetches current price for a cryptocurrency (e.g., `bitcoin`, `ethereum`).
- **GET `/candles/:symbol`**: Fetches OHLC candle data for charts.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
