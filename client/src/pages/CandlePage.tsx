import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Candle from '@/components/candle/Candle';
import { db } from '@/lib/firebase';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';

export function CandlePage() {
  const [isLit, setIsLit] = React.useState(false);
  const [lastLit, setLastLit] = React.useState<Date | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  React.useEffect(() => {
    if (!user) return;
    const fetchLitTimes = async () => {
      const q = query(collection(db, 'candle_lit_times'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      if (snapshot.docs.length > 0) {
        const latest = snapshot.docs[0].data();
        setIsLit(true);
        setLastLit(new Date(latest.litAt));
      }
    };
    fetchLitTimes();
  }, [user]);

  const handleLightCandle = async () => {
    setIsLit(true);
    const litAt = new Date();
    setLastLit(litAt);
    if (user) {
      await addDoc(collection(db, 'candle_lit_times'), { userId: user.uid, litAt: litAt.toISOString() });
    }
  };

  const handleBlowOut = () => {
    setIsLit(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          ליועלי נשמת חיה שרה לאה בת אורי זצ״ל
        </h1>
        <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-3">
          Memorial Candle for Chaya Sara Leah Bas Uri זצ״ל
        </h2>
        <p className="text-lg text-yellow-600 dark:text-yellow-400 italic">
          May her neshomoh have an aliyah
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Candle Section */}
        <div className="space-y-6">
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
                <p className="font-medium">חיה שרה לאה בת אורי זצ״ל</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prayers Section with Flowing Effects - Kotel Inspired */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-green-50 border-2 border-amber-300 shadow-2xl overflow-hidden relative">
            {/* Flowing light effects - Kotel inspired */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-amber-400 via-yellow-400 to-green-400 animate-pulse delay-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse delay-1000"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 via-amber-400 to-yellow-400 animate-pulse delay-1500"></div>
            </div>
            
            <CardContent className="p-6 space-y-6 relative z-10">
              <div className="text-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-green-600 bg-clip-text text-transparent mb-2">
                  🕯️ Candle Lighting Prayers
                </h3>
                <p className="text-sm bg-gradient-to-r from-amber-700 via-yellow-600 to-green-700 bg-clip-text text-transparent">
                  Sacred blessings for lighting a memorial candle
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Main Candle Blessing */}
                <Card className="bg-white/90 border-2 border-amber-300 shadow-lg">
                  <CardContent className="p-5">
                    <h4 className="font-bold text-amber-800 mb-3 text-center">Memorial Candle Blessing</h4>
                    <div className="space-y-3">
                      <div className="text-center p-3 bg-gradient-to-r from-amber-100 to-green-100 rounded-lg">
                        <p className="text-lg font-semibold text-amber-900 mb-2">
                          בָּרוּךְ אַתָּה יי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ לְהַדְלִיק נֵר שֶׁל זִכָּרוֹן
                        </p>
                        <p className="text-sm text-amber-700 mb-2">
                          Baruch atah Adonai, Eloheinu melech ha'olam, asher kidshanu b'mitzvotav v'tzivanu l'hadlik ner shel zikaron
                        </p>
                        <p className="text-xs text-green-600 italic">
                          "Blessed are You, Lord our God, King of the universe, who has sanctified us with His commandments and commanded us to light a memorial candle"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prayer for the Soul */}
                <Card className="bg-white/90 border-2 border-green-300 shadow-lg">
                  <CardContent className="p-5">
                    <h4 className="font-bold text-green-800 mb-3 text-center">Prayer for Her Soul</h4>
                    <div className="space-y-3">
                      <div className="text-center p-3 bg-gradient-to-r from-green-100 to-amber-100 rounded-lg">
                        <p className="text-lg font-semibold text-green-900 mb-2">
                          יְהִי רָצוֹן מִלְּפָנֶיךָ יי אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ, שֶׁתְּהֵא נַפְשָׁהּ שֶׁל חַיָּה שָׂרָה לֵאָה בַּת אוּרִי צְרוּרָה בִּצְרוֹר הַחַיִּים
                        </p>
                        <p className="text-sm text-green-700 mb-2">
                          Yehi ratzon milfanecha Adonai Eloheinu v'Elohei avoteinu, shetehei nafsho shel Chaya Sara Leah bat Uri tzrurah bitzror hachaim
                        </p>
                        <p className="text-xs text-amber-600 italic">
                          "May it be Your will, Lord our God and God of our fathers, that the soul of Chaya Sara Leah bat Uri be bound in the bond of eternal life"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Short Memorial Prayers */}
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-white/80 border border-amber-200">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-amber-700 mb-2">תהא נשמתה צרורה בצרור החיים</h4>
                      <p className="text-sm text-amber-600 mb-1">Tehei nafsho tzerurah bitzror hachaim</p>
                      <p className="text-xs text-gray-600 italic">"May her soul be bound in the bond of eternal life"</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 border border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-yellow-700 mb-2">זכותה יגן עלינו ועל כל ישראל</h4>
                      <p className="text-sm text-yellow-600 mb-1">Zechutah yagen aleinu v'al kol Yisrael</p>
                      <p className="text-xs text-gray-600 italic">"May her merit protect us and all Israel"</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 border border-green-200">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-medium text-green-700 mb-2">ה' יהיה לה לאור עולם</h4>
                      <p className="text-sm text-green-600 mb-1">Hashem yihyeh lah le'or olam</p>
                      <p className="text-xs text-gray-600 italic">"May God be an eternal light for her"</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-6 p-4 bg-gradient-to-r from-amber-100 via-yellow-100 to-green-100 rounded-lg border-2 border-amber-300">
                  <p className="text-sm text-amber-800 font-medium mb-2">
                    ✨ Light flows with every prayer ✨
                  </p>
                  <p className="text-xs text-green-700 italic">
                    Each blessing spoken with intention creates spiritual light that elevates her holy soul. 
                    The candle's flame represents the eternal nature of the neshamah.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
