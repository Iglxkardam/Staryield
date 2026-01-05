import { Card } from '@/components';
import { useStarPoints, formatPoints } from '@/hooks';
import './StarPointsCard.css';

export const StarPointsCard = () => {
  const { totalPoints } = useStarPoints();

  return (
    <Card className="star-points-card">
      <div className="star-points-header">
        <div className="star-icon">⭐</div>
        <h3>Star Points</h3>
      </div>
      
      <div className="points-display">
        <div className="points-value">{formatPoints(totalPoints)}</div>
        <div className="points-label">Total Points Earned</div>
      </div>

      <div className="points-info">
        <div className="info-item">
          <span className="info-icon">💰</span>
          <span className="info-text">1 ETH/BNB = 1,000 points</span>
        </div>
        <div className="info-item">
          <span className="info-icon">📅</span>
          <span className="info-text">Earn every 7 days</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🎁</span>
          <span className="info-text">Points accumulate automatically</span>
        </div>
      </div>

      <div className="points-note">
        Points are awarded instantly when you stake and every 7 days thereafter based on your stake amount.
      </div>
    </Card>
  );
};
