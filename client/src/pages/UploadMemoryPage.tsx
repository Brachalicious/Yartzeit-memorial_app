import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function UploadMemoryPage() {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [memoryType, setMemoryType] = React.useState<'album' | 'scrapbook'>('album');
  const [albumName, setAlbumName] = React.useState('');
  const [feelings, setFeelings] = React.useState('');
  const [selectedStickers, setSelectedStickers] = React.useState<string[]>([]);
  const [showKotel, setShowKotel] = React.useState(false);

  // Available stickers
  const stickers = ['🌟', '💖', '🌸', '🦋', '🌈', '💫', '🕊️', '🌺', '💝', '🎀', '🌹', '✨'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSticker = (sticker: string) => {
    setSelectedStickers(prev => 
      prev.includes(sticker) 
        ? prev.filter(s => s !== sticker)
        : [...prev, sticker]
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    if (!albumName) {
      alert('Please enter a name for your ' + memoryType);
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('memoryType', memoryType);
    formData.append('albumName', albumName);
    formData.append('feelings', feelings);
    formData.append('stickers', JSON.stringify(selectedStickers));

    try {
      // For now, just show success message since backend endpoint needs to be created
      alert(`${memoryType === 'album' ? 'Album' : 'Scrapbook'} "${albumName}" created successfully with ${selectedFiles.length} files!`);
      
      // Reset form
      setSelectedFiles([]);
      setAlbumName('');
      setFeelings('');
      setSelectedStickers([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📸 Create Beautiful Memories</h1>
        <p className="text-gray-600">Upload photos and videos to create albums or decorated scrapbooks</p>
      </div>

      {/* Kotel Live Section */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center text-blue-800">🕊️ Visit the Kotel Live</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700">Connect spiritually by watching the Western Wall live</p>
          
          <Dialog open={showKotel} onOpenChange={setShowKotel}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                🏛️ Go to Kotel Live
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-center">🕊️ The Western Wall - Live Stream</DialogTitle>
              </DialogHeader>
              <div className="flex-1 h-full">
                <iframe
                  src="https://thekotel.org/en/live/"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', minHeight: '500px' }}
                  title="Kotel Live Stream"
                  allow="fullscreen"
                />
              </div>
            </DialogContent>
          </Dialog>
          
          <p className="text-sm text-gray-600 italic">
            "May your prayers ascend to Heaven from this holy place"
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Memory Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Memory Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={memoryType === 'album' ? "default" : "outline"}
                onClick={() => setMemoryType('album')}
                className="flex-1"
              >
                📚 Photo Album
              </Button>
              <Button
                variant={memoryType === 'scrapbook' ? "default" : "outline"}
                onClick={() => setMemoryType('scrapbook')}
                className="flex-1"
              >
                🎨 Decorated Scrapbook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{memoryType === 'album' ? 'Album' : 'Scrapbook'} Name</Label>
              <Input
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                placeholder={`Name your ${memoryType}...`}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Photos & Videos</Label>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({selectedFiles.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative bg-gray-100 p-3 rounded flex justify-between items-center">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFile(index)}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stickers & Decorations */}
        <Card>
          <CardHeader>
            <CardTitle>✨ Add Cute Stickers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {stickers.map(sticker => (
                <Button
                  key={sticker}
                  variant={selectedStickers.includes(sticker) ? "default" : "outline"}
                  className="h-12 w-12 text-2xl p-0"
                  onClick={() => toggleSticker(sticker)}
                >
                  {sticker}
                </Button>
              ))}
            </div>
            {selectedStickers.length > 0 && (
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-2">Selected Stickers:</p>
                <div className="text-3xl">{selectedStickers.join(' ')}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feelings Section */}
        <Card>
          <CardHeader>
            <CardTitle>� Share Your Feelings</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              placeholder="Write about your memories, feelings, or thoughts..."
              rows={6}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Preview & Submit */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Preview Your {memoryType === 'album' ? 'Album' : 'Scrapbook'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {albumName && (
                <h3 className="text-xl font-bold mb-2">{albumName}</h3>
              )}
              {selectedStickers.length > 0 && (
                <div className="text-2xl mb-4">{selectedStickers.join(' ')}</div>
              )}
              <p className="text-gray-600">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              </p>
              {feelings && (
                <div className="mt-4 p-3 bg-blue-50 rounded italic text-sm">
                  "{feelings.slice(0, 100)}{feelings.length > 100 ? '...' : ''}"
                </div>
              )}
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={selectedFiles.length === 0 || !albumName}
              className="w-full"
              size="lg"
            >
              🎉 Create {memoryType === 'album' ? 'Album' : 'Scrapbook'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
