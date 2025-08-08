import React, { useState } from 'react';
import '../../index.css'; // make sure Tailwind & flicker animation are loaded

interface CandleProps {
  isLit?: boolean;
  onLightCandle?: () => void;
}

const Candle: React.FC<CandleProps> = ({ isLit: propIsLit, onLightCandle }) => {
  const [internalIsLit, setInternalIsLit] = useState(false);
  
  // Use prop if provided, otherwise use internal state
  const isLit = propIsLit !== undefined ? propIsLit : internalIsLit;

  const toggleCandle = () => {
    if (onLightCandle) {
      onLightCandle();
    } else {
      setInternalIsLit(!internalIsLit);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="relative">
        <img
          src={isLit ? 'candle_lit.png' : 'candle_unlit.png'}
          alt={isLit ? 'Lit Candle' : 'Unlit Candle'}
          onClick={toggleCandle}
          className={`cursor-pointer transition duration-300 ${
            isLit ? 'animate-pulse' : ''
          }`}
          style={{ width: '65rem', height: '38rem', objectFit: 'fill' }}
        />
        <div className="absolute top-[320px] left-0 right-0 flex justify-center -ml-8">
          <div className="text-center px-4 pointer-events-auto">
            <p className="font-bold leading-tight drop-shadow-lg transition-all duration-300 hover:scale-125 transform cursor-pointer" 
               style={{ 
                 fontSize: '12px',
                 color: '#0f172a',
                 textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(15, 23, 42, 0.6)',
                 fontFamily: 'serif'
               }}>
              חיה שרה לאה<br/>
              בת אורי
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candle;
