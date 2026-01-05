import React, { useState } from 'react';
import Card, { CardTitle } from '@components/Card';
import Button from '@components/Button';
import { useReferral } from '@/hooks/useReferral';
import { useNotification } from '@/hooks/useNotification';
import { isAddress } from 'viem';

interface ReferralLinkCardProps {
  referralLink: string;
}

const ReferralLinkCard: React.FC<ReferralLinkCardProps> = ({ referralLink }) => {
  const [referrerAddress, setReferrerAddress] = useState('');
  const { setReferrer, hasReferrer, referrer, isSettingReferrer } = useReferral();
  const { showNotification } = useNotification();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      showNotification('Referral link copied!', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSubmitReferrer = async () => {
    if (!referrerAddress.trim()) {
      showNotification('Please enter a referrer address', 'error');
      return;
    }

    if (!isAddress(referrerAddress)) {
      showNotification('Invalid address format', 'error');
      return;
    }

    try {
      const result = await setReferrer(referrerAddress);
      if (result.success) {
        showNotification('Referrer set successfully! 🎉', 'success');
        setReferrerAddress('');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set referrer';
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <Card className="referral-link">
      <CardTitle 
        title="Your StarPath Link"
        subtitle="Invite Explorers, Harvest Rewards"
      />
      <div className="link-box d-flex align-items-center">
        <div className="link-title">
          <i className="fa-solid fa-link"></i> Referal Link
        </div>
        <div className="r-link">{referralLink}</div>
        <Button variant="skyblue" onClick={handleCopy}>Copy</Button>
      </div>

      {/* Referral Code Input Section */}
      <div className="link-box d-flex align-items-center" style={{ marginTop: '15px' }}>
        {hasReferrer && referrer ? (
          <>
            <div className="link-title" style={{ color: '#4CAF50' }}>
              <i className="fa-solid fa-check-circle"></i> Referrer Set
            </div>
            <div className="r-link" style={{ color: '#4CAF50' }}>{referrer}</div>
            <div style={{ 
              padding: '8px 16px', 
              background: 'rgba(76, 175, 80, 0.2)', 
              borderRadius: '6px',
              fontSize: '14px',
              color: '#4CAF50',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}>
              Locked
            </div>
          </>
        ) : (
          <>
            <div className="link-title">
              <i className="fa-solid fa-user-plus"></i> Referral Code
            </div>
            <div className="r-link">
              <input 
                type="text" 
                placeholder="Enter referrer address"
                value={referrerAddress}
                onChange={(e) => setReferrerAddress(e.target.value)}
                disabled={isSettingReferrer}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'inherit',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  padding: 0
                }}
              />
            </div>
            <Button 
              variant="skyblue" 
              onClick={handleSubmitReferrer}
              disabled={isSettingReferrer || !referrerAddress}
            >
              {isSettingReferrer ? 'Setting...' : 'Submit'}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default ReferralLinkCard;
