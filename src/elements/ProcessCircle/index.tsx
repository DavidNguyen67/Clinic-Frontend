import './style.scss';

import React from 'react';

interface ProcessCircleProps {
  size: number;
  borderWidth: number;
  percent: number;
  padding?: number; //padding = 5
  stroke?: string; //#A0AEC0
}

const ProcessCircle = ({ size, borderWidth, percent, ...props }: ProcessCircleProps) => {
  const circumference = size * 2 * Math.PI;
  const offset = circumference + (percent / 100) * circumference;
  const padding = props.padding ?? 5;
  const stroke = props.stroke ?? '#09E384';

  return (
    <div className="progress-circle">
      <svg
        className="progress-ring"
        style={{
          strokeDasharray: `${circumference}, ${circumference}`,
          strokeDashoffset: offset,
        }}
        width={size * 2 + padding}
        height={size * 2 + padding}
      >
        <circle
          className="progress-ring__circle"
          stroke={stroke}
          strokeWidth={borderWidth}
          fill="transparent"
          r={size}
          cx={size + padding / 2}
          cy={size + padding / 2}
        />
      </svg>
    </div>
  );
};

export default ProcessCircle;
