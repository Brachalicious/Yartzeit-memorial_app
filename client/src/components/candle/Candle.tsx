import * as React from 'react';

interface CandleProps {
  isLit: boolean;
  onLightCandle: () => void;
}

export function Candle({ isLit, onLightCandle }: CandleProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Flame */}
      {isLit && (
        <div className="relative mb-1">
          <div className="w-4 h-8 bg-gradient-to-t from-orange-400 via-yellow-400 to-red-400 rounded-full animate-pulse relative">
            <div className="absolute inset-0 w-4 h-8 bg-gradient-to-t from-orange-500 via-yellow-300 to-yellow-100 rounded-full animate-bounce" 
                 style={{ animationDuration: '1.5s' }}>
            </div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-gradient-to-t from-yellow-300 to-white rounded-full opacity-80 animate-pulse">
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-2 bg-orange-300 rounded-full blur-lg opacity-30 animate-pulse"></div>
        </div>
      )}
      
      {/* Wick */}
      <div 
        className={`w-1 h-3 transition-colors cursor-pointer ${
          isLit ? 'bg-red-800' : 'bg-gray-800 hover:bg-gray-600'
        }`}
        onClick={!isLit ? onLightCandle : undefined}
        title={!isLit ? 'Click to light the candle' : 'Wick is burning'}
      ></div>
      
      {/* Candle body */}
      <div className="w-12 h-32 bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-200 dark:to-amber-300 rounded-sm shadow-lg">
        <div className="w-full h-2 bg-amber-200 dark:bg-amber-300 rounded-t-sm"></div>
      </div>
      
      {/* Candle base/holder */}
      <div className="w-16 h-4 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-sm shadow-md mt-1">
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-500 rounded-t-sm"></div>
      </div>
      
      {/* Dripping wax effect when lit */}
      {isLit && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-4 bg-amber-100 dark:bg-amber-200 rounded-full opacity-70 animate-pulse" 
               style={{ animationDelay: '0.5s' }}>
          </div>
        </div>
      )}
    </div>
  );
}
