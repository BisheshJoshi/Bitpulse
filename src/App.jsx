import { useState, useEffect, useRef } from 'react'
import Chart from 'react-apexcharts'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia, polygonMumbai } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import WalletDashboard from './WalletDashboard'
import './App.css'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '56925a6a53d04383aba76227a7747fb2'

// 2. Create wagmiConfig
const metadata = {
  name: 'BitPulse',
  description: 'BitPulse Crypto Dashboard & Wallet',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, sepolia, polygonMumbai]
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#00E396',
    '--w3m-border-radius-master': '1px'
  }
})

// 4. Create QueryClient
const queryClient = new QueryClient()

const COINS = [
  { symbol: 'bitcoin', name: 'BTC', startPrice: 65000 },
  { symbol: 'ethereum', name: 'ETH', startPrice: 3500 },
  { symbol: 'solana', name: 'SOL', startPrice: 145 },
  { symbol: 'xrp', name: 'XRP', startPrice: 0.60 },
  { symbol: 'dogecoin', name: 'DOGE', startPrice: 0.12 },
]

function App() {
  const [activeCoin, setActiveCoin] = useState('bitcoin')
  const [price, setPrice] = useState('0.00')
  const [candleData, setCandleData] = useState([]) // OHLC Data
  const [marketDeals, setMarketDeals] = useState([]) // Best Price Aggregator
  const [trend, setTrend] = useState('neutral')
  const [status, setStatus] = useState('Initializing...') 
  const prevPriceRef = useRef(0)
  
  // Reset history when coin changes
  useEffect(() => {
    setCandleData([])
    setMarketDeals([])
    setPrice('0.00')
    setTrend('neutral')
    setStatus('Loading...')
    prevPriceRef.current = 0
  }, [activeCoin])

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch Live Price (Ticker)
        const priceRes = await fetch(`http://localhost:3001/price/${activeCoin}`)
        if (priceRes.ok) {
          const data = await priceRes.json()
          const currentPrice = parseFloat(data.price)
          
          setStatus(`Live (${data.source})`)
          
          const formattedPrice = currentPrice < 1 
            ? currentPrice.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
            : currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

          setPrice(formattedPrice)

          if (prevPriceRef.current > 0) {
            if (currentPrice > prevPriceRef.current) setTrend('up')
            else if (currentPrice < prevPriceRef.current) setTrend('down')
          }
          prevPriceRef.current = currentPrice
        }

        // 2. Fetch Candle Data (Chart)
        const candleRes = await fetch(`http://localhost:3001/candles/${activeCoin}`)
        if (candleRes.ok) {
          const candles = await candleRes.json()
          setCandleData([{
            data: candles
          }])
        }

        // 3. Fetch Best Market Deals (Aggregator)
        const dealsRes = await fetch(`http://localhost:3001/tickers/${activeCoin}`)
        if (dealsRes.ok) {
          const deals = await dealsRes.json()
          setMarketDeals(deals)
        }

      } catch (error) {
        console.error('Fetch Error:', error)
        setStatus('Retrying...')
      }
    }

    fetchAllData() // Initial call
    const interval = setInterval(fetchAllData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [activeCoin]) 

  const getTrendColor = () => {
    if (trend === 'up') return '#00E396' // Green
    if (trend === 'down') return '#FF4560' // Red
    return '#ffffff'
  }

  // ApexCharts Options
  const chartOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    title: { text: '', align: 'left' },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#888' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        style: { colors: '#888' },
        formatter: (value) => { return value < 1 ? value.toFixed(4) : value.toFixed(2) }
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 3
    },
    theme: { mode: 'dark' },
    plotOptions: {
      candlestick: {
        colors: { upward: '#E5E4E2', downward: '#FFD700' },
        wick: { useFillColor: true }
      }
    }
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="dashboard-container">
          {/* Header Bar */}
          <header className="dashboard-header">
            <div className="brand">
              <h1>BitPulse</h1>
              <span className="live-dot" style={{ background: status.includes('Live') ? '#00E396' : 'orange' }}></span>
              <small>{status}</small>
            </div>
            
            <div className="coin-selector">
              {COINS.map((coin) => (
                <button
                  key={coin.symbol}
                  className={`coin-btn ${activeCoin === coin.symbol ? 'active' : ''}`}
                  onClick={() => setActiveCoin(coin.symbol)}
                >
                  {coin.name}
                </button>
              ))}
            </div>
            
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="header-price">
                <span className="pair">{COINS.find(c => c.symbol === activeCoin)?.name}/USDT</span>
                <h2 style={{ color: getTrendColor() }}>${price}</h2>
              </div>
            </div>
          </header>
          
          {/* Main Grid Content */}
          <main className="dashboard-grid">
            
            {/* Left Column: Chart + Wallet */}
            <div className="left-column">
              {/* Chart Panel */}
              <section className="panel chart-panel">
                <div className="panel-header">
                  <h3>Live Market Chart</h3>
                </div>
                <div className="chart-wrapper">
                  {candleData.length > 0 ? (
                    <Chart 
                      options={chartOptions} 
                      series={candleData} 
                      type="candlestick" 
                      width="100%" 
                      height="100%" 
                    />
                  ) : (
                    <div className="loading">Loading Chart Data...</div>
                  )}
                </div>
              </section>

              {/* Wallet Panel */}
              <section className="panel wallet-panel">
                 <div className="panel-header">
                    <h3>Wallet & Trading</h3>
                 </div>
                 <WalletDashboard />
              </section>
            </div>

            {/* Right Panel: Best Deals */}
            <section className="panel deals-panel">
              <div className="panel-header">
                <h3>Best Market Deals ⚡</h3>
                <small>Cheapest exchanges right now</small>
              </div>
              
              <div className="deals-list">
                {marketDeals.length > 0 ? (
                  marketDeals.map((deal, index) => (
                    <div key={index} className={`deal-card ${index === 0 ? 'best-deal' : ''}`}>
                      <div className="deal-info">
                        <span className="exchange-name">{deal.exchange}</span>
                        <span className="deal-pair">{deal.pair}</span>
                      </div>
                      <div className="deal-price">
                        <span className="price-value">${parseFloat(deal.price).toLocaleString()}</span>
                        {index === 0 && <span className="badge">BEST</span>}
                      </div>
                      <a href={deal.url} target="_blank" rel="noopener noreferrer" className="buy-btn">
                        Buy
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="loading">Finding best prices...</div>
                )}
              </div>
            </section>

          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
