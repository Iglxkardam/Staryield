import { useStakePoints, getDaysUntilNextClaim, formatPoints } from '@/hooks';
import './StakePointsDisplay.css';

interface StakePointsDisplayProps {
  stakeId: number;
  isActive: boolean;
}

export const StakePointsDisplay: React.FC<StakePointsDisplayProps> = ({ stakeId, isActive }) => {
  const { stakePointsInfo } = useStakePoints(stakeId);

  if (!stakePointsInfo || !isActive) {
    return null;
  }

  const daysUntilNext = getDaysUntilNextClaim(stakePointsInfo.nextClaimTime);
  const hasPending = stakePointsInfo.pendingPoints > 0;

  return (
    <div className="stake-points-display">
      <div className="points-header">
        <span className="points-icon">⭐</span>
        <span className="points-title">Star Points</span>
      </div>
      
      <div className="points-grid">
        <div className="points-item">
          <div className="points-item-label">Earned</div>
          <div className="points-item-value">{formatPoints(stakePointsInfo.totalPoints)}</div>
        </div>
        
        {hasPending && (
          <div className="points-item pending">
            <div className="points-item-label">Pending</div>
            <div className="points-item-value">+{formatPoints(stakePointsInfo.pendingPoints)}</div>
          </div>
        )}
        
        <div className="points-item">
          <div className="points-item-label">Next Claim</div>
          <div className="points-item-value">
            {daysUntilNext === 0 ? 'Ready!' : `${daysUntilNext}d`}
          </div>
        </div>
      </div>

      {hasPending && (
        <div className="points-notice">
          <span className="notice-icon">💡</span>
          <span className="notice-text">
            Pending points auto-claim on next interaction
          </span>
        </div>
      )}
    </div>
  );
};
