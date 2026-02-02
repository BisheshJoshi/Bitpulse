import { useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useDebounce } from "use-debounce";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

function TransactionPage() {
  const { open } = useWeb3Modal();
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);
  
  const { data: hash, sendTransaction, isPending } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (debouncedTo && debouncedAmount) {
      sendTransaction({
        to: debouncedTo,
        value: parseEther(debouncedAmount),
      });
    }
  };

  return (
    <div className="transaction-page" style={{ padding: '1rem' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#fff' }}>Send Crypto</h3>
      
      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.9rem' }}>Recipient Address</label>
          <input
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '8px',
              color: '#fff',
              outline: 'none'
            }}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            value={to}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.9rem' }}>Amount (ETH)</label>
          <input
             style={{ 
              width: '100%', 
              padding: '0.75rem', 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '8px',
              color: '#fff',
              outline: 'none'
            }}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            value={amount}
          />
        </div>

        <button 
          disabled={isPending || !to || !amount}
          style={{
            background: '#00E396',
            color: '#000',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: (isPending || !to || !amount) ? 'not-allowed' : 'pointer',
            opacity: (isPending || !to || !amount) ? 0.6 : 1,
            marginTop: '0.5rem'
          }}
        >
          {isPending ? "Sending..." : "Send Now"}
        </button>
        
        {isConfirmed && (
          <div style={{ marginTop: '1rem', color: '#00E396', background: 'rgba(0, 227, 150, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
            <p style={{ margin: 0 }}><strong>Transaction Successful!</strong></p>
            <small style={{ color: '#888', wordBreak: 'break-all', display: 'block', marginTop: '0.25rem' }}>Hash: {hash}</small>
          </div>
        )}
      </form>
      
      <button 
        onClick={() => open()} 
        style={{ 
          background: 'transparent', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          color: '#888', 
          fontSize: '0.8rem', 
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Wallet Settings
      </button>
    </div>
  );
}

export default TransactionPage;
