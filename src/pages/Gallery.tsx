import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Play, 
  X,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  tags: string[];
}

const galleryItems: MediaItem[] = [
  // Community Events
  {
    id: '1',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg',
    title: 'Community Event Highlights',
    description: 'Amazing moments from our community gathering',
    category: 'Community',
    date: 'March 2024',
    location: 'Event Center',
    tags: ['community', 'gathering', 'social']
  },
  {
    id: '2',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1679_ovnanp.jpg',
    title: 'Group Activities',
    description: 'Fun group activities and team bonding',
    category: 'Activities',
    date: 'March 2024',
    location: 'Activity Center',
    tags: ['activities', 'group', 'fun']
  },
  {
    id: '3',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1684_pv0ohb.jpg',
    title: 'Team Building Session',
    description: 'Building stronger connections through teamwork',
    category: 'Team Building',
    date: 'March 2024',
    location: 'Training Venue',
    tags: ['teambuilding', 'collaboration', 'skills']
  },
  {
    id: '4',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1414_ij80mu.jpg',
    title: 'Social Gathering',
    description: 'Creating lasting friendships and memories',
    category: 'Social',
    date: 'February 2024',
    location: 'Meeting Hall',
    tags: ['social', 'networking', 'friends']
  },
  {
    id: '5',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1424_f0harp.jpg',
    title: 'Event Highlights',
    description: 'Best moments captured from our events',
    category: 'Highlights',
    date: 'February 2024',
    location: 'Activity Space',
    tags: ['highlights', 'moments', 'memories']
  },
  {
    id: '6',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1623_olhksw.jpg',
    title: 'Community Fun',
    description: 'Joy and laughter in our community',
    category: 'Recreation',
    date: 'February 2024',
    location: 'Recreation Center',
    tags: ['fun', 'recreation', 'joy']
  },
  // Team Photos
  {
    id: '7',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2393_cv5xbp.jpg',
    title: 'Team Red Champions',
    description: 'Team Red celebrating their victory',
    category: 'Team Red',
    date: 'January 2024',
    location: 'Tournament Hall',
    tags: ['team red', 'victory', 'champions']
  },
  {
    id: '8',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915398/_MG_2403_hknyss.jpg',
    title: 'Team Green Adventure',
    description: 'Team Green on their outdoor adventure',
    category: 'Team Green',
    date: 'January 2024',
    location: 'Nature Park',
    tags: ['team green', 'adventure', 'outdoor']
  },
  {
    id: '9',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918906/_MG_2027_oblrvo.jpg',
    title: 'Team Blue Victory',
    description: 'Team Blue achieving success together',
    category: 'Team Blue',
    date: 'January 2024',
    location: 'Competition Venue',
    tags: ['team blue', 'victory', 'success']
  },
  {
    id: '10',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915401/_MG_2185_rqpdrv.jpg',
    title: 'Team Yellow in Action',
    description: 'Team Yellow showing their team spirit',
    category: 'Team Yellow',
    date: 'January 2024',
    location: 'Event Center',
    tags: ['team yellow', 'action', 'spirit']
  },
  // More Community Events
  {
    id: '11',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1656_yoiklo.jpg',
    title: 'Creative Session',
    description: 'Exploring creativity and innovation',
    category: 'Creative',
    date: 'December 2023',
    location: 'Studio',
    tags: ['creative', 'innovation', 'art']
  },
  {
    id: '12',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1677_v8n5nu.jpg',
    title: 'Group Workshop',
    description: 'Learning and growing together',
    category: 'Learning',
    date: 'December 2023',
    location: 'Workshop Hall',
    tags: ['workshop', 'learning', 'growth']
  },
  {
    id: '13',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1758_mj5kho.jpg',
    title: 'Community Celebration',
    description: 'Celebrating our achievements together',
    category: 'Celebrations',
    date: 'December 2023',
    location: 'Victory Hall',
    tags: ['celebration', 'achievement', 'success']
  },
  {
    id: '14',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1776_eob5jv.jpg',
    title: 'Team Collaboration',
    description: 'Working together towards common goals',
    category: 'Collaboration',
    date: 'November 2023',
    location: 'Innovation Lab',
    tags: ['collaboration', 'teamwork', 'goals']
  },
  {
    id: '15',
    type: 'image',
    url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/back_k2fwpf.jpg',
    title: 'Event Background',
    description: 'Behind the scenes of our events',
    category: 'Behind the Scenes',
    date: 'November 2023',
    location: 'Event Space',
    tags: ['behind scenes', 'setup', 'preparation']
  }
];

const categories = ['All', 'Community', 'Team Red', 'Team Green', 'Team Blue', 'Team Yellow', 'Activities', 'Celebrations', 'Learning'];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Team Red': return 'bg-red-500 text-white';
      case 'Team Green': return 'bg-green-500 text-white';
      case 'Team Blue': return 'bg-blue-500 text-white';
      case 'Team Yellow': return 'bg-yellow-500 text-white';
      case 'Community': return 'bg-purple-500 text-white';
      case 'Activities': return 'bg-orange-500 text-white';
      case 'Celebrations': return 'bg-pink-500 text-white';
      case 'Learning': return 'bg-indigo-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleDownload = (item: MediaItem) => {
    // In a real app, this would trigger actual download
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `${item.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
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
        // Fallback to copying link
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
              Explore our collection of memories, moments, and milestones from the Games & Connect community
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <motion.div 
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedItem(item)}
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(item);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Modal for viewing images */}
      {selectedItem && (
        <motion.div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setSelectedItem(null)}
        >
          <motion.div 
            className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/20 text-white hover:bg-black/40"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="aspect-video max-h-[70vh] overflow-hidden">
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                  <p className="text-muted-foreground mb-3">{selectedItem.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedItem)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(selectedItem)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedItem.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedItem.location}</span>
                </div>
                <Badge className={getCategoryColor(selectedItem.category)}>
                  {selectedItem.category}
                </Badge>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
