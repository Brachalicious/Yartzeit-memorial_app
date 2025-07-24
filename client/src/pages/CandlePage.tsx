import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Candle } from '@/components/candle/Candle';

export function CandlePage() {
  const [isLit, setIsLit] = React.useState(false);
  const [lastLit, setLastLit] = React.useState<Date | null>(null);

  const handleLightCandle = () => {
    setIsLit(true);
    setLastLit(new Date());
  };

  const handleBlowOut = () => {
    setIsLit(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          ליועלי נשמת חיה שרה לאה בת אורי
        </h1>
        <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-3">
          Memorial Candle for Chaya Sara Leah Bas Uri
        </h2>
        <p className="text-lg text-yellow-600 dark:text-yellow-400 italic">
          May her neshomoh have an aliyah
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <Candle isLit={isLit} onLightCandle={handleLightCandle} />
            </div>
            
            <div className="space-y-4">
              {!isLit ? (
                <div>
                  <p className="text-muted-foreground mb-4">
                    Click the wick to light a memorial candle
                  </p>
                  <Button onClick={handleLightCandle} className="w-full">
                    Light Memorial Candle
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Memorial candle is burning
                  </p>
                  {lastLit && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Lit at {lastLit.toLocaleTimeString()}
                    </p>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={handleBlowOut}
                    className="w-full"
                  >
                    Blow Out Candle
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>In loving memory</p>
              <p className="font-medium">חיה שרה לאה בת אורי</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
