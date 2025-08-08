import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ExternalLink, Heart, BookOpen, Users, Lightbulb, Star, Video, Plus, Share, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { addDoc, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [activeSection, setActiveSection] = React.useState<'resources' | 'videos'>('resources');
  const [showAddVideo, setShowAddVideo] = React.useState(false);
  const [newVideoUrl, setNewVideoUrl] = React.useState('');
  const [newVideoTitle, setNewVideoTitle] = React.useState('');
  const [newVideoDescription, setNewVideoDescription] = React.useState('');
  const [customVideos, setCustomVideos] = React.useState<Array<{
    id: string;
    title: string;
    description: string;
    embedId: string;
    addedBy: string;
    dateAdded: string;
  }>>([]);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Load custom videos from Firestore on component mount
  React.useEffect(() => {
    const fetchVideos = async () => {
      if (user) {
        const q = query(collection(db, 'resource_videos'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const videos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomVideos(videos);
      }
    };

    fetchVideos();
  }, [user]);

  // Save custom videos to Firestore whenever they change
  React.useEffect(() => {
    if (user) {
      customVideos.forEach(async (video) => {
        await addDoc(collection(db, 'resource_videos'), {
          ...video,
          userId: user.uid,
        });
      });
    }
  }, [customVideos, user]);

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  // Add a new custom video
  const addCustomVideo = () => {
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) {
      alert('Please enter both a video title and YouTube URL');
      return;
    }

    const videoId = extractYouTubeId(newVideoUrl);
    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    const newVideo = {
      id: videoId,
      title: newVideoTitle.trim(),
      description: newVideoDescription.trim() || 'User-contributed inspiring video',
      embedId: videoId,
      addedBy: 'Community Member',
      dateAdded: new Date().toLocaleDateString()
    };

    setCustomVideos(prev => [...prev, newVideo]);
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoDescription('');
    setShowAddVideo(false);
  };

  // Default inspiring videos
  const defaultVideos = [
    {
      id: 'eF-r6msb3ww',
      title: 'Inspirational Memorial Content',
      description: 'A meaningful video for reflection and spiritual guidance',
      embedId: 'eF-r6msb3ww',
      addedBy: 'Resource Library',
      dateAdded: 'Default'
    },
    {
      id: '-11yDytacVE',
      title: 'Special Memorial Video',
      description: 'A meaningful video dedicated to remembrance and healing',
      embedId: '-11yDytacVE',
      addedBy: 'Resource Library',
      dateAdded: 'Default'
    },
    {
      id: 'bkA64ldkSH8',
      title: 'Comfort and Healing',
      description: 'A beautiful message of hope and healing during difficult times',
      embedId: 'bkA64ldkSH8',
      addedBy: 'Resource Library',
      dateAdded: 'Default'
    },
    {
      id: 'trbwkSofXTk',
      title: 'Finding Strength in Faith',
      description: 'Inspirational guidance for finding strength through Jewish wisdom',
      embedId: 'trbwkSofXTk',
      addedBy: 'Resource Library',
      dateAdded: 'Default'
    },
    {
      id: 'VBJL8TZ0kLU',
      title: 'Jewish Perspectives on Loss',
      description: 'Understanding grief and mourning through Jewish teachings',
      embedId: 'VBJL8TZ0kLU',
      addedBy: 'Resource Library',
      dateAdded: 'Default'
    },
    {
      id: 'oI7yshOwJMk',
      title: 'Memorial and Remembrance',
      description: 'Beautiful teachings on honoring the memory of loved ones',
      embedId: 'oI7yshOwJMk',
      addedBy: 'Resource Library',
      dateAdded: 'Default'
    }
  ];

  const allVideos = [...defaultVideos, ...customVideos];

  const resources = [
    {
      id: 1,
      title: "14 Jewish Ways to Honor the Soul of a Deceased Loved One",
      description: "Comprehensive guide to meaningful Jewish traditions and practices for honoring the memory of those who have passed away.",
      url: "https://www.chabad.org/library/article_cdo/aid/372952/jewish/14-Jewish-Ways-to-Honor-the-Soul-of-a-Deceased-Loved-One.htm",
      category: "Memorial Practices",
      icon: <Heart className="h-5 w-5" />,
      highlights: [
        "Learn Torah in their memory",
        "Give charity (tzedakah)",
        "Light a memorial candle",
        "Say Kaddish",
        "Visit the grave",
        "Study Mishnah"
      ]
    },
    {
      id: 2,
      title: "Place a Note in the Western Wall",
      description: "Send your prayers and notes directly to the Western Wall in Jerusalem through trusted online services.",
      url: "https://aish.com/place-a-note-in-the-western-wall/?done=1",
      category: "Prayer & Connection",
      icon: <BookOpen className="h-5 w-5" />,
      highlights: [
        "Real-time placement at the Kotel",
        "Prayers for healing and remembrance",
        "Connect spiritually with Jerusalem",
        "Memorial notes for loved ones"
      ]
    },
    {
      id: 3,
      title: "Hillside Memorial - Notes to the Wall",
      description: "Alternative service for placing memorial notes and prayers at the Western Wall with special dedication options.",
      url: "https://www.hillsidememorial.org/notes-to-the-wall",
      category: "Prayer & Connection",
      icon: <Users className="h-5 w-5" />,
      highlights: [
        "Memorial note placement",
        "Special dedication services",
        "Professional placement team",
        "Confirmation of placement"
      ]
    },
    {
      id: 4,
      title: "Understanding Yahrzeit",
      description: "Learn about the Jewish tradition of observing the anniversary of a loved one's passing.",
      url: "https://www.chabad.org/library/article_cdo/aid/281541/jewish/Yahrzeit.htm",
      category: "Jewish Traditions",
      icon: <Lightbulb className="h-5 w-5" />,
      highlights: [
        "When to observe yahrzeit",
        "Lighting the memorial candle",
        "Saying Kaddish",
        "Learning Torah"
      ]
    },
    {
      id: 5,
      title: "The Power of Tehillim (Psalms)",
      description: "Understanding the spiritual significance of reciting Psalms for healing and remembrance.",
      url: "https://www.chabad.org/library/article_cdo/aid/682956/jewish/The-Power-of-Tehillim.htm",
      category: "Torah Study",
      icon: <Star className="h-5 w-5" />,
      highlights: [
        "Healing through psalms",
        "Which chapters to say",
        "Memorial psalm recitation",
        "Group psalm study"
      ]
    },
    {
      id: 6,
      title: "Understanding Grief and Healing",
      description: "Comprehensive Torah perspectives on grief, healing, and finding meaning after loss.",
      url: "https://outorah.org/p/72715/",
      category: "Torah Study",
      icon: <Heart className="h-5 w-5" />,
      highlights: [
        "Torah wisdom on grief",
        "Spiritual healing guidance", 
        "Finding meaning in loss",
        "Jewish approaches to mourning"
      ]
    },
    {
      id: 7,
      title: "Laws of Mourning",
      description: "Comprehensive guide to Jewish mourning practices and the stages of grief according to Jewish law.",
      url: "https://www.chabad.org/library/article_cdo/aid/281010/jewish/Laws-of-Mourning.htm",
      category: "Jewish Law",
      icon: <BookOpen className="h-5 w-5" />,
      highlights: [
        "Shiva practices",
        "Sheloshim period",
        "First year mourning",
        "Comforting the mourners"
      ]
    }
  ];

  const categories = [
    "All",
    "Memorial Practices", 
    "Prayer & Connection",
    "Jewish Traditions",
    "Torah Study",
    "Jewish Law"
  ];

  const filteredResources = selectedCategory === "All" 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 bg-clip-text text-transparent mb-4">
            לעילוי נשמת חיה שרה לאה בת אורי זצ״ל
          </h2>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent mb-4">
            📚 Memorial Resources
          </h1>
          <p className="text-lg bg-gradient-to-r from-blue-700 to-amber-700 bg-clip-text text-transparent mb-2 font-semibold">
            Jewish guidance for honoring the memory of loved ones
          </p>
          <p className="text-sm bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent italic mb-6 font-medium">
            Traditional wisdom and modern tools for meaningful remembrance
          </p>
        </div>

        {/* Section Toggle */}
        <Card className="mb-8 shadow-lg border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardTitle className="text-center">Choose Section</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant={activeSection === 'resources' ? "default" : "outline"}
                onClick={() => setActiveSection('resources')}
                className={`transition-all duration-300 flex items-center gap-2 ${
                  activeSection === 'resources'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Articles & Resources
              </Button>
              <Button
                variant={activeSection === 'videos' ? "default" : "outline"}
                onClick={() => setActiveSection('videos')}
                className={`transition-all duration-300 flex items-center gap-2 ${
                  activeSection === 'videos'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'border-purple-300 text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Video className="h-4 w-4" />
                Inspiring Videos
              </Button>
            </div>
          </CardContent>
        </Card>

        {activeSection === 'resources' && (
        <>
        {/* Category Filter */}
        <Card className="mb-8 shadow-lg border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-center">Filter Resources by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="shadow-lg border-2 border-amber-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-r from-amber-600 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {resource.icon}
                  {resource.title}
                </CardTitle>
                <div className="text-sm bg-white/20 rounded-full px-3 py-1 self-start">
                  {resource.category}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {resource.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Key Topics:</h4>
                  <ul className="space-y-1">
                    {resource.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-amber-500">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  onClick={() => window.open(resource.url, '_blank')}
                  className="w-full bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        </>
        )}

        {activeSection === 'videos' && (
        <div className="space-y-8">
          {/* Add Video Section */}
          <Card className="shadow-lg border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Video className="h-6 w-6" />
                Inspiring Videos Library
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Button
                  onClick={() => setShowAddVideo(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Inspiring Video
                </Button>
                <Button
                  onClick={() => {
                    const shareText = `🎥 Discover inspiring videos for comfort and healing at our Memorial Resources page: ${window.location.href}

Join me in finding strength through these meaningful videos, all dedicated to the memory of Chaya Sara Leah Bas Uri zt"l.

לעילוי נשמת חיה שרה לאה בת אורי ז״ל`;

                    if (navigator.share) {
                      navigator.share({
                        title: 'Inspiring Videos - Memorial Resources',
                        text: shareText,
                      });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      alert('Share link copied to clipboard! 📋');
                    }
                  }}
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share Video Library
                </Button>
              </div>

              {/* Add Video Form */}
              {showAddVideo && (
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-purple-800">Add Inspiring Video</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddVideo(false)}
                        className="text-purple-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="video-title">Video Title</Label>
                        <Input
                          id="video-title"
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                          placeholder="Enter video title"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="video-url">YouTube URL</Label>
                        <Input
                          id="video-url"
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="video-description">Description (optional)</Label>
                        <Textarea
                          id="video-description"
                          value={newVideoDescription}
                          onChange={(e) => setNewVideoDescription(e.target.value)}
                          placeholder="Describe how this video provides comfort or inspiration..."
                          rows={3}
                          className="mt-1 resize-none"
                        />
                      </div>
                      
                      <Button
                        onClick={addCustomVideo}
                        disabled={!newVideoTitle.trim() || !newVideoUrl.trim()}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        Add Video to Library
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <p className="text-gray-700 mb-4">
                A curated collection of inspiring videos for comfort, healing, and spiritual guidance. 
                Each video is chosen to provide hope and strength during difficult times.
              </p>
            </CardContent>
          </Card>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allVideos.map((video, index) => (
              <Card key={video.id} className="shadow-lg border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    {video.title}
                  </CardTitle>
                  <div className="text-sm bg-white/20 rounded-full px-3 py-1 self-start">
                    Added by {video.addedBy}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative w-full h-0 pb-[56.25%]">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${video.embedId}?si=YA9zGxTFRmDlibuc`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {video.description}
                    </p>
                    
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button
                        onClick={() => {
                          window.open(`https://www.youtube.com/watch?v=${video.embedId}`, '_blank');
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Watch on YouTube
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const shareText = `🎥 "${video.title}" - An inspiring video for comfort and healing.

Watch: https://www.youtube.com/watch?v=${video.embedId}

Found in our Memorial Resources dedicated to Chaya Sara Leah Bas Uri zt"l: ${window.location.href}

לעילוי נשמת חיה שרה לאה בת אורי ז״ל`;

                          if (navigator.share) {
                            navigator.share({
                              title: video.title,
                              text: shareText,
                            });
                          } else {
                            navigator.clipboard.writeText(shareText);
                            alert('Video link copied to clipboard! 📋');
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Share className="h-4 w-4" />
                        Share Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        )}

        {/* Memorial Dedication */}
        <Card className="shadow-lg border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Heart className="h-6 w-6" />
              In Memory of Chaya Sara Leah Bas Uri
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 leading-relaxed mb-4">
              These resources are dedicated to the elevation of the holy soul of Chaya Sara Leah Bas Uri zt"l. 
              May her memory be a blessing and may these teachings help us honor the souls of all our loved ones 
              according to Jewish tradition and wisdom.
            </p>
            <p className="text-sm text-purple-600 italic">
              "The righteous are greater in their death than in their lifetime" - Talmud
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
