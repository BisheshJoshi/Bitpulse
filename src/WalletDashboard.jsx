import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import TransactionPage from "./TransactionPage";

function WalletDashboard() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  if (isConnected) {
    return <TransactionPage />;
  } else {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        minHeight: '200px',
        textAlign: 'center',
        gap: '1rem',
        padding: '2rem'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(229, 228, 226, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E5E4E2',
          fontSize: '1.5rem'
        }}>
          ⚡
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Connect Wallet</h3>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
            Connect your wallet to enable trading features directly from the dashboard.
          </p>
        </div>
        <button 
          onClick={() => open()}
          style={{
            background: '#00E396',
            color: '#000',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '0.5rem',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Connect Wallet
        </button>
      </div>
    );
  }
}

export default WalletDashboard;
