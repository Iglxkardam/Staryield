import React, { useState } from 'react';
import { useReferral } from '@/hooks/useReferral';
import { useNotification } from '@/hooks/useNotification';

interface ReferralInputProps {
  onSuccess?: () => void;
}

const ReferralInput: React.FC<ReferralInputProps> = ({ onSuccess }) => {
  const [referrerAddress, setReferrerAddress] = useState('');
  const { setReferrer, hasReferrer, referrer, isSettingReferrer } = useReferral();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!referrerAddress.trim()) {
      showNotification('Please enter a referrer address', 'error');
      return;
    }

    if (!referrerAddress.startsWith('0x') || referrerAddress.length !== 42) {
      showNotification('Invalid address format', 'error');
      return;
    }

    try {
      const result = await setReferrer(referrerAddress);
      if (result.success) {
        showNotification('Referrer set successfully! 🎉', 'success');
        setReferrerAddress('');
        onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to set referrer';
      showNotification(errorMessage, 'error');
    }
  };

  // If user already has a referrer, show locked state
  if (hasReferrer && referrer) {
    return (
      <div className="referral-input-container" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ color: '#4CAF50', marginBottom: '8px', fontSize: '18px' }}>
            ✅ Referrer Set
          </h4>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            Your referrer has been set and locked
          </p>
        </div>
        
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '14px',
          wordBreak: 'break-all',
          color: '#4CAF50',
        }}>
          {referrer}
        </div>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.8)',
        }}>
          🔒 Referrer cannot be changed once set
        </div>
      </div>
    );
  }

  // Show input form if no referrer set
  return (
    <div className="referral-input-container" style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#fff', marginBottom: '8px', fontSize: '18px' }}>
          Have a Referral Code?
        </h4>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
          Enter the wallet address of the person who referred you
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            marginBottom: '8px',
            fontWeight: '500',
          }}>
            Referrer Address
          </label>
          <input
            type="text"
            value={referrerAddress}
            onChange={(e) => setReferrerAddress(e.target.value)}
            placeholder="0x..."
            disabled={isSettingReferrer}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSettingReferrer || !referrerAddress}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: isSettingReferrer || !referrerAddress 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isSettingReferrer || !referrerAddress ? 'not-allowed' : 'pointer',
            opacity: isSettingReferrer || !referrerAddress ? 0.5 : 1,
            transition: 'all 0.3s ease',
          }}
        >
          {isSettingReferrer ? 'Setting Referrer...' : 'Submit Referral Code'}
        </button>
      </form>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'rgba(33, 150, 243, 0.1)',
        border: '1px solid rgba(33, 150, 243, 0.3)',
        borderRadius: '8px',
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.8)',
      }}>
        ℹ️ You can only set a referrer once. Make sure the address is correct!
      </div>
    </div>
  );
};

export default ReferralInput;
