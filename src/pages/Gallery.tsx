import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  Download,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGalleryItems, GalleryItem } from '@/lib/gallery-api';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
}

// Convert GalleryItem to MediaItem format
const convertGalleryItemToMediaItem = (item: GalleryItem): MediaItem => ({
  id: item.id,
  type: item.type,
  url: item.url,
  thumbnail: item.thumbnail,
  title: item.title,
  description: item.description,
});

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('images');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load gallery items from database
  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await getGalleryItems();
        setGalleryItems(items);
      } catch (error) {
        console.error('Failed to load gallery items:', error);
        setError('Failed to load gallery items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadGalleryItems();
  }, []);

  // Filter items by type
  const images = galleryItems.filter(item => item.type === 'image').map(convertGalleryItemToMediaItem);
  const videos = galleryItems.filter(item => item.type === 'video').map(convertGalleryItemToMediaItem);

  const currentItems = activeTab === 'images' ? images : videos;
  const currentIndex = activeTab === 'images' ? currentImageIndex : currentVideoIndex;
  const setCurrentIndex = activeTab === 'images' ? setCurrentImageIndex : setCurrentVideoIndex;

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? currentItems.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === currentItems.length - 1 ? 0 : currentIndex + 1);
  };

  const openModal = (item: MediaItem) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalItem(null);
  };

  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (item: MediaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border-b"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Our <span className="text-primary">Gallery</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-white/80 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Explore our collection of memories and moments from the Games & Connect community
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gallery items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Gallery</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="images" className="text-lg">Images ({images.length})</TabsTrigger>
              <TabsTrigger value="videos" className="text-lg">Videos ({videos.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="images" className="space-y-6">
              <GalleryContent 
                items={images}
                currentIndex={currentImageIndex}
                setCurrentIndex={setCurrentImageIndex}
                onPrevious={goToPrevious}
                onNext={goToNext}
                onItemClick={openModal}
              />
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-6">
              <GalleryContent 
                items={videos}
                currentIndex={currentVideoIndex}
                setCurrentIndex={setCurrentVideoIndex}
                onPrevious={goToPrevious}
                onNext={goToNext}
                onItemClick={openModal}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && modalItem && (
        <motion.div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={closeModal}
        >
          <motion.div 
            className="relative max-w-5xl max-h-full bg-white rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/20 text-white hover:bg-black/40"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="aspect-video max-h-[80vh] overflow-hidden">
              {modalItem.type === 'video' ? (
                <video
                  controls
                  className="w-full h-full object-contain"
                  poster={modalItem.thumbnail}
                >
                  <source src={modalItem.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={modalItem.url}
                  alt={modalItem.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(modalItem)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(modalItem)}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface GalleryContentProps {
  items: MediaItem[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onItemClick: (item: MediaItem) => void;
}

function GalleryContent({ 
  items, 
  currentIndex, 
  setCurrentIndex, 
  onPrevious, 
  onNext, 
  onItemClick 
}: GalleryContentProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📷</div>
        <h3 className="text-xl font-semibold mb-2">No items available</h3>
        <p className="text-muted-foreground">Check back later for new content</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Image/Video Display */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          {currentItem.type === 'video' ? (
            <div className="relative w-full h-full">
              <img
                src={currentItem.thumbnail || currentItem.url}
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Button
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => onItemClick(currentItem)}
                >
                  <Play className="h-8 w-8 mr-2" />
                  Play Video
                </Button>
              </div>
            </div>
          ) : (
            <img
              src={currentItem.url}
              alt={currentItem.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onItemClick(currentItem)}
              onError={(e) => {
                console.warn('Failed to load image:', currentItem.url);
                // Replace with a fallback image
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600/cccccc/666666?text=Image+Not+Found';
              }}
            />
          )}
          
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="lg"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
            onClick={onPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
            onClick={onNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground text-center">
            {currentIndex + 1} of {items.length}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Strip */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 ${
                index === currentIndex 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : 'hover:opacity-80'
              }`}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={item.type === 'video' ? (item.thumbnail || item.url) : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.warn('Failed to load thumbnail:', item.url);
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image';
                  }}
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
