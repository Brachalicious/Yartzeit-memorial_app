import * as React from 'react';
import { useYahrzeit } from '@/hooks/useYahrzeit';
import { UpcomingYahrzeits } from '@/components/yahrzeit/UpcomingYahrzeits';
import { YahrzeitForm } from '@/components/yahrzeit/YahrzeitForm';
import { Card, CardContent } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';

export function YahrzeitPage() {
  const { upcomingYahrzeits, loading, error, createEntry } = useYahrzeit();
  const { currentSong, setCurrentSong } = useMusic();
  const isIDFMusicPlaying = currentSong === 'idf';

  const handleIDFMusicToggle = () => {
    if (isIDFMusicPlaying) {
      setCurrentSong(null);
    } else {
      setCurrentSong('idf');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            Loading yahrzeit information...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            Error: {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Memorial Sky Overlay with Hebrew Text and Flying Doves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
        {/* Heavenly Clouds with Glowing Effect */}
        <div className="absolute top-8 left-1/4 w-24 h-12 bg-white/30 rounded-full animate-pulse filter blur-sm"></div>
        <div className="absolute top-16 right-1/3 w-32 h-16 bg-white/25 rounded-full animate-pulse delay-1000 filter blur-sm"></div>
        <div className="absolute top-12 left-1/2 w-20 h-10 bg-white/35 rounded-full animate-pulse delay-500 filter blur-sm"></div>
        <div className="absolute top-6 right-1/4 w-28 h-14 bg-white/20 rounded-full animate-pulse delay-2000 filter blur-sm"></div>
        <div className="absolute top-20 left-1/5 w-36 h-18 bg-white/30 rounded-full animate-pulse delay-1500 filter blur-sm"></div>
        <div className="absolute top-36 right-1/5 w-24 h-12 bg-white/25 rounded-full animate-pulse delay-3000 filter blur-sm"></div>
        
        {/* Flying Doves - 3 Doves Flying in Heaven on the Kotel */}
        <div className="absolute top-0 left-0 w-full h-screen">
          {/* Dove 1 - Flying from left to right across the top */}
          <img
            src="/dove_no_background.png"
            alt=""
            className="absolute w-12 h-12 opacity-95 drop-shadow-lg"
            style={{
              left: '10%',
              top: '15%',
              animation: 'flyAcrossLeft 25s linear infinite, float 3s ease-in-out infinite',
              filter: 'brightness(1.3) contrast(1.2)'
            }}
          />
          
          {/* Dove 2 - Flying from right to left in the middle */}
          <img
            src="/dove_no_background.png"
            alt=""
            className="absolute w-11 h-11 opacity-90 drop-shadow-lg"
            style={{
              right: '15%',
              top: '25%',
              animation: 'flyAcrossRight 30s linear infinite, soar 4s ease-in-out infinite',
              filter: 'brightness(1.3) contrast(1.2)'
            }}
          />
          
          {/* Dove 3 - Flying upward from bottom to heaven */}
          <img
            src="/dove_no_background.png"
            alt=""
            className="absolute w-10 h-10 opacity-85 drop-shadow-lg"
            style={{
              left: '70%',
              bottom: '30%',
              animation: 'flyUpward 35s linear infinite, gentle 5s ease-in-out infinite',
              filter: 'brightness(1.2) contrast(1.1)'
            }}
          />
        </div>
      </div>

      {/* CSS Animations for Doves */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes flyAcrossLeft {
          0% { left: -10%; transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(8deg); }
          50% { transform: translateY(10px) rotate(-5deg); }
          75% { transform: translateY(-8px) rotate(3deg); }
          100% { left: 110%; transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes flyAcrossRight {
          0% { right: -10%; transform: translateY(0px) rotateY(180deg) rotate(0deg); }
          25% { transform: translateY(-20px) rotateY(180deg) rotate(8deg); }
          50% { transform: translateY(12px) rotateY(180deg) rotate(-5deg); }
          75% { transform: translateY(-10px) rotateY(180deg) rotate(3deg); }
          100% { right: 110%; transform: translateY(0px) rotateY(180deg) rotate(0deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(3deg); }
          66% { transform: translateY(8px) rotate(-2deg); }
        }
        
        @keyframes soar {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-18px) rotate(-8deg) scale(1.1); }
          50% { transform: translateY(6px) rotate(4deg) scale(0.9); }
          75% { transform: translateY(-12px) rotate(-2deg) scale(1.05); }
        }
        
        @keyframes flyUpward {
          0% { bottom: -10%; left: 70%; transform: translateX(-50%) rotate(0deg); }
          25% { bottom: 25%; left: 75%; transform: translateX(-50%) rotate(-15deg); }
          50% { bottom: 50%; left: 65%; transform: translateX(-50%) rotate(10deg); }
          75% { bottom: 75%; left: 72%; transform: translateX(-50%) rotate(-8deg); }
          100% { bottom: 110%; left: 68%; transform: translateX(-50%) rotate(0deg); }
        }
        
        @keyframes gentle {
          0%, 100% { transform: translateX(-50%) rotate(0deg) scale(1); }
          33% { transform: translateX(-50%) rotate(-5deg) scale(1.05); }
          66% { transform: translateX(-50%) rotate(3deg) scale(0.95); }
        }
        `
      }} />

      {/* Page Content with higher z-index */}
      <div className="relative z-10">
      <div className="text-center py-8 bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 dark:from-blue-900/20 dark:to-amber-900/20 rounded-lg border border-gradient-to-r border-blue-200 dark:border-blue-800 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-amber-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
          ליועלי נשמת חיה שרה לאה בת אורי ז״ל
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent mb-4">
          Liulei Nishmas Chaya Sara Leah Bas Uri זצ״ל
        </h2>
        <p className="text-lg md:text-xl bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent italic font-semibold">
          May her neshomoh have an aliyah
        </p>
        <div className="mt-6">
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 via-amber-600 to-blue-800 bg-clip-text text-transparent">
            Yahrzeit Tracker and Memorial
          </h3>
        </div>        </div>

        {/* Yahrzeit Entries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <UpcomingYahrzeits yahrzeits={upcomingYahrzeits} />
          </div>
          
          <div>
            <YahrzeitForm onSubmit={createEntry} title="Quick Add Entry" />
          </div>
        </div>

        {/* IDF Prayer Section - Moved below entries and smaller */}
        <div className="text-center py-4 bg-gradient-to-r from-green-50 via-blue-50 to-amber-50 dark:from-green-900/20 dark:to-amber-900/20 rounded-lg border border-gradient-to-r border-green-200 dark:border-green-800 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-amber-600 bg-clip-text text-transparent">
              תפילה לחיילי צה"ל
            </h3>
            <button
              onClick={handleIDFMusicToggle}
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors shadow-md"
              title={isIDFMusicPlaying ? "Stop IDF Song" : "Play IDF Song"}
            >
              {isIDFMusicPlaying ? (
                <span className="text-white text-xs">⏹️</span>
              ) : (
                <span className="text-white text-xs">🎵</span>
              )}
            </button>
          </div>
          <h4 className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-700 via-blue-700 to-amber-700 bg-clip-text text-transparent mb-3">
            Prayer for the IDF Soldiers
          </h4>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Hebrew Text - Smaller */}
            <div className="text-right text-sm md:text-base leading-relaxed bg-gradient-to-r from-green-700 via-blue-700 to-amber-700 bg-clip-text text-transparent font-semibold">
              <p className="mb-2">
                מי שברך אבותינו אברהם יצחק ויעקב - הוא יברך את לוחמי צבא הגנה לישראל, העומדים על משמר ארצנו וערי אלהינו, מגבול הלבנון ועד מדבר מצרים, ומן הים הגדול עד לבוא הערבה, ביבשה באויר ובים.
              </p>
              <p className="mb-2">
                יתן ה' את איבינו הקמים עלינו נגפים לפניהם. יהברך הקדוש ברוך הוא וישמרהו ויצילהו מכל צרה וצוקה, ומכל נגע ומחלה, וישלח ברכה והצלחה בכל מעשה ידיהם.
              </p>
              <p className="mb-2">
                יכניע איבינו תחתיהם ויעטרם בכתר ישועה ובעטרת נצחון. ויתקים בהם הכתוב: כי ה' אלהיכם ההלך עמכם להלחם לכם עם איביכם להושיע אתכם.
              </p>
            </div>
            
            {/* English Text - Smaller */}
            <div className="text-left text-sm md:text-base leading-relaxed bg-gradient-to-r from-green-700 via-blue-700 to-amber-700 bg-clip-text text-transparent font-semibold">
              <p className="mb-2">
                He Who blessed our forefathers Abraham, Isaac and Jacob -- may He bless the fighters of the Israel Defense Forces, who stand guard over our land and the cities of our God, from the border of the Lebanon to the desert of Egypt, and from the Great Sea unto the approach of the Aravah, on the land, in the air, and on the sea.
              </p>
              <p className="mb-2">
                May the Almighty cause the enemies who rise up against us to be struck down before them. May the Holy One, Blessed is He, preserve and rescue our fighters from every trouble and distress and from every plague and illness, and may He send blessing and success in their every endeavor.
              </p>
              <p className="mb-2">
                May He lead our enemies under our soldiers' sway and may He grant them salvation and crown them with victory. And may there be fulfilled for them the verse: For it is the Lord your God, Who goes with you to battle your enemies for you to save you.
              </p>
            </div>
          </div>

          {/* Hidden IDF Music Player */}
          {isIDFMusicPlaying && (
            <iframe
              width="0"
              height="0"
              src="https://www.youtube.com/embed/OMXHlwUfG-E?autoplay=1&mute=0&loop=1&playlist=OMXHlwUfG-E&rel=0&modestbranding=1&iv_load_policy=3&controls=0"
              title="IDF Song"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ display: 'none' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
