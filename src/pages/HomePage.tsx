import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEvents, Event } from '@/lib/api';
import { useTypingEffect } from '@/hooks/use-typing-effect';
import { getEventUrl } from '@/lib/utils';
import { RecentWinners } from '@/components/RecentWinners';

export default function HomePage() {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Image rotation for hero grid
  const [currentImageSet, setCurrentImageSet] = useState(0);
  
  const imageSets = [
    [
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1414_ij80mu.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1679_ovnanp.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1684_pv0ohb.jpg"
    ],
    [
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2393_cv5xbp.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915398/_MG_2403_hknyss.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918906/_MG_2027_oblrvo.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915401/_MG_2185_rqpdrv.jpg"
    ],
    [
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1656_yoiklo.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1677_v8n5nu.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1758_mj5kho.jpg",
      "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1776_eob5jv.jpg"
    ]
  ];

  // Typing effect for the hero header
  const { displayedText: typedText, isTyping } = useTypingEffect({
    text: "Play.\nTravel.\nConnect.",
    speed: 150,
    delay: 800
  });

  useEffect(() => {
    async function loadNextEvent() {
      try {
        const events = await getEvents();
        const currentDate = new Date();
        
        // Filter for future events and get the nearest one
        const upcomingEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate > currentDate;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        if (upcomingEvents.length > 0) {
          setNextEvent(upcomingEvents[0]);
        }
      } catch (error) {
        console.error('Failed to load next event:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadNextEvent();
  }, []);

  // Image rotation effect
  useEffect(() => {
    const imageRotationTimer = setInterval(() => {
      setCurrentImageSet((prev) => (prev + 1) % imageSets.length);
    }, 4000); // Change images every 4 seconds

    return () => clearInterval(imageRotationTimer);
  }, [imageSets.length]);

  // Countdown timer effect
  useEffect(() => {
    if (!nextEvent) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventDate = new Date(nextEvent.date).getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section 
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"
      >
        {/* Logo-inspired gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-blue-500/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left side - Text content */}
            <div>
              <motion.h1 
                className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {typedText.split('\n').map((line, index) => (
                  <div key={index}>
                    {line === 'Travel.' ? (
                      <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{line}</span>
                    ) : (
                      line
                    )}
                    {index < typedText.split('\n').length - 1 && <br />}
                  </div>
                ))}
                {isTyping && (
                  <motion.span
                    className="inline-block w-1 h-16 lg:h-20 bg-gradient-to-b from-orange-400 to-red-500 ml-2"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  />
                )}
              </motion.h1>
              
              <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
                Join a growing community of young Ghanaians making memories through fun, adventure, and connection. Experience our exciting events, travel adventures, and build lasting friendships.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/events">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full shadow-lg shadow-orange-500/25"
                  >
                    Join the Journey
                  </Button>
                </Link>
                <Link to="/events">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-transparent border-blue-400/50 text-blue-200 hover:bg-blue-500/10 hover:border-blue-400 px-8 py-3 rounded-full"
                  >
                    Explore Events
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-transparent border-purple-400/50 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400 px-8 py-3 rounded-full"
                  >
                    Read Our Blog
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Image grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {/* Top left - Large image */}
                <div className="col-span-1 row-span-2">
                  <motion.img 
                    key={`main-${currentImageSet}`}
                    src={imageSets[currentImageSet][0]}
                    alt="Community event"
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                
                {/* Top right - Event image */}
                <div className="col-span-1">
                  <motion.img 
                    key={`top-${currentImageSet}`}
                    src={imageSets[currentImageSet][1]}
                    alt="Event activity"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </div>
                
                {/* Bottom right - Activity image */}
                <div className="col-span-1">
                  <motion.img 
                    key={`bottom-${currentImageSet}`}
                    src={imageSets[currentImageSet][2]}
                    alt="Group activity"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
              </div>
              
              {/* Bottom full-width image */}
              <div className="mt-6">
                <motion.img 
                  key={`full-${currentImageSet}`}
                  src={imageSets[currentImageSet][3]}
                  alt="Team building event"
                  className="w-full h-40 object-cover rounded-2xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <motion.section 
        className="py-20 bg-muted/20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Event Flyer */}
              <motion.div 
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={nextEvent?.image_url || "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/cape-coast-flyer_bqx8md.jpg"}
                  alt={`${nextEvent?.title || 'Upcoming Event'} Flyer`}
                  className="w-full h-full object-cover aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
                <motion.div 
                  className="absolute top-6 right-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/30"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(249, 115, 22, 0.7)",
                        "0 0 0 10px rgba(249, 115, 22, 0)",
                        "0 0 0 0 rgba(249, 115, 22, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    REGISTER NOW
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="absolute bottom-6 left-6 right-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-orange-400" />
                      <span className="text-sm font-medium">
                        {loading ? 'Loading...' : nextEvent ? nextEvent.date : 'Date TBA'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">
                        {loading ? 'Loading...' : nextEvent ? nextEvent.location : 'Location TBA'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                NEXT ADVENTURE
              </motion.div>
              
              <motion.h2 
                className="text-5xl font-black text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                {loading ? (
                  'Loading Next Adventure...'
                ) : nextEvent ? (
                  <>
                    {nextEvent.title.split(' ').map((word, index, array) => 
                      index === array.length - 1 ? (
                        <span key={index} className="text-primary">{word}</span>
                      ) : (
                        word + ' '
                      )
                    )}
                  </>
                ) : (
                  <>No Upcoming <span className="text-primary">Adventures</span></>
                )}
              </motion.h2>
              
              <motion.p 
                className="text-xl text-muted-foreground leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
              >
                {loading ? (
                  'Loading event details...'
                ) : nextEvent ? (
                  nextEvent.description || 'Join us for an exciting upcoming event!'
                ) : (
                  'Stay tuned for exciting new adventures coming soon!'
                )}
              </motion.p>

              <motion.div 
                className="space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                viewport={{ once: true }}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">⏳</span>
                    </div>
                    <span className="text-foreground">Loading event details...</span>
                  </div>
                ) : nextEvent ? (
                  <>
                    {nextEvent.includes && nextEvent.includes.length > 0 ? (
                      nextEvent.includes.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold">✓</span>
                          </div>
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold">📅</span>
                          </div>
                          <span className="text-foreground">{nextEvent.date} at {nextEvent.time_range || nextEvent.time || 'TBA'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold">📍</span>
                          </div>
                          <span className="text-foreground">{nextEvent.location}</span>
                        </div>
                        {nextEvent.price && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-primary font-bold">💰</span>
                            </div>
                            <span className="text-foreground">{nextEvent.price}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold">🤝</span>
                          </div>
                          <span className="text-foreground">Community Bonding & Networking</span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">�</span>
                      </div>
                      <span className="text-foreground">Gaming Tournaments & Competitions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">🌍</span>
                      </div>
                      <span className="text-foreground">Weekend Getaways & Adventures</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">🤝</span>
                      </div>
                      <span className="text-foreground">Community Bonding & Networking</span>
                    </div>
                  </>
                )}
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90"
                    onClick={() => nextEvent ? window.open(getEventUrl(nextEvent.title), '_self') : window.open('/events', '_self')}
                  >
                    {nextEvent ? `Register for ${nextEvent.title}` : 'Explore Events'}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="rounded-full text-base px-8 py-6"
                    onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                  >
                    Ask Questions
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                viewport={{ once: true }}
              >
                {loading ? (
                  <div className="text-center text-muted-foreground text-sm">
                    Loading countdown...
                  </div>
                ) : nextEvent ? (
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Event starts in:</div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{countdown.days}</div>
                        <div className="text-xs text-muted-foreground">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{countdown.hours}</div>
                        <div className="text-xs text-muted-foreground">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{countdown.minutes}</div>
                        <div className="text-xs text-muted-foreground">Min</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{countdown.seconds}</div>
                        <div className="text-xs text-muted-foreground">Sec</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm">
                    No upcoming events scheduled
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Three Pillars */}
      <motion.section 
        className="py-20 bg-slate-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-black text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our <span className="text-primary">Three Pillars</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-white/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Everything we do is built around our core philosophy: Play, Travel, and Connect
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[
              {
                icon: "🎮",
                title: "PLAY",
                subtitle: "Gaming & Entertainment",
                description: "From tournaments to casual game nights, we celebrate the joy of play in all its forms.",
                features: ["Gaming Tournaments", "Board Games", "Video Games", "Card Games"]
              },
              {
                icon: "✈️",
                title: "TRAVEL",
                subtitle: "Adventures & Exploration",
                description: "Discover Ghana's hidden gems and beyond with fellow adventurers who share your wanderlust.",
                features: ["Cape Coast Tours", "Cultural Sites", "Beach Adventures", "Historical Exploration"]
              },
              {
                icon: "🤝",
                title: "CONNECT",
                subtitle: "Community & Relationships",
                description: "Build meaningful friendships and professional networks in Ghana's most welcoming community.",
                features: ["Networking Events", "Skill Workshops", "WhatsApp Community", "Social Gatherings"]
              }
            ].map((pillar, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + (index * 0.2) }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.2 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {pillar.icon}
                </motion.div>
                <motion.h3 
                  className="text-3xl font-black text-white mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.0 + (index * 0.2) }}
                  viewport={{ once: true }}
                >
                  {pillar.title}
                </motion.h3>
                <motion.h4 
                  className="text-lg font-semibold text-primary mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 + (index * 0.2) }}
                  viewport={{ once: true }}
                >
                  {pillar.subtitle}
                </motion.h4>
                <motion.p 
                  className="text-white/70 leading-relaxed mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.4 + (index * 0.2) }}
                  viewport={{ once: true }}
                >
                  {pillar.description}
                </motion.p>
                <motion.ul 
                  className="text-sm text-white/60 space-y-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.6 + (index * 0.2) }}
                  viewport={{ once: true }}
                >
                  {pillar.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.8 + (index * 0.2) + (featureIndex * 0.1) }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: featureIndex * 0.2 }}
                      ></motion.div>
                      {feature}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Games Collection */}
      <motion.section 
        className="py-20 bg-muted/20 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="w-full">
          <motion.div 
            className="text-center mb-16 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-black text-foreground mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our <span className="text-primary">Games Collection</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Explore our variety of exciting games and activities for all skill levels
            </motion.p>
          </motion.div>
          
          {/* Auto-scrolling games - First row (left to right) */}
          <div className="relative mb-8">
            <div className="flex overflow-hidden">
              <motion.div 
                className="flex gap-6 min-w-full"
                animate={{ x: [0, -1000] }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                {[
                  { name: "Archery", emoji: "🏹", level: "Intermediate" },
                  { name: "Card Games", emoji: "🃏", level: "Beginner" },
                  { name: "Cup Games", emoji: "🥤", level: "Beginner" },
                  { name: "Darts", emoji: "🎯", level: "Beginner" },
                  { name: "Football", emoji: "⚽", level: "Intermediate" },
                  { name: "Limbo", emoji: "🤸", level: "Beginner" },
                  { name: "Shooting Range", emoji: "🎪", level: "Intermediate" },
                  { name: "UNO", emoji: "🎴", level: "Beginner" },
                  { name: "Volleyball", emoji: "🏐", level: "Intermediate" },
                  // Duplicate for seamless loop
                  { name: "Archery", emoji: "🏹", level: "Intermediate" },
                  { name: "Card Games", emoji: "🃏", level: "Beginner" },
                  { name: "Cup Games", emoji: "🥤", level: "Beginner" },
                  { name: "Darts", emoji: "🎯", level: "Beginner" },
                  { name: "Football", emoji: "⚽", level: "Intermediate" }
                ].map((game, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-background rounded-2xl p-6 text-center shadow-lg min-w-[180px] flex-shrink-0"
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: 10,
                      zIndex: 10
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="text-5xl mb-4"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1] 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: index * 0.2 
                      }}
                    >
                      {game.emoji}
                    </motion.div>
                    <h3 className="font-bold text-foreground mb-2 text-lg">{game.name}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {game.level}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Auto-scrolling games - Second row (right to left) */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <motion.div 
                className="flex gap-6 min-w-full"
                animate={{ x: [-1000, 0] }}
                transition={{ 
                  duration: 25, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                {[
                  { name: "Chess", emoji: "♟️", level: "Advanced" },
                  { name: "Pool", emoji: "🎱", level: "Intermediate" },
                  { name: "Table Tennis", emoji: "🏓", level: "Beginner" },
                  { name: "Video Games", emoji: "🎮", level: "All Levels" },
                  { name: "Trivia", emoji: "🧠", level: "Beginner" },
                  { name: "Karaoke", emoji: "🎤", level: "Beginner" },
                  { name: "Dance", emoji: "💃", level: "All Levels" },
                  { name: "Charades", emoji: "🎭", level: "Beginner" },
                  { name: "Scrabble", emoji: "🔤", level: "Intermediate" },
                  // Duplicate for seamless loop
                  { name: "Chess", emoji: "♟️", level: "Advanced" },
                  { name: "Pool", emoji: "🎱", level: "Intermediate" },
                  { name: "Table Tennis", emoji: "🏓", level: "Beginner" },
                  { name: "Video Games", emoji: "🎮", level: "All Levels" },

                ].map((game, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-background rounded-2xl p-6 text-center shadow-lg min-w-[180px] flex-shrink-0"
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: -10,
                      zIndex: 10
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="text-5xl mb-4"
                      animate={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1] 
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        delay: index * 0.3 
                      }}
                    >
                      {game.emoji}
                    </motion.div>
                    <h3 className="font-bold text-foreground mb-2 text-lg">{game.name}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {game.level}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Call to action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-muted-foreground mb-6"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              And many more exciting games waiting for you!
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full"
                onClick={() => window.open('/events', '_self')}
              >
                Join Our Next Game Night
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Recent Winners Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentWinners limit={1} showImages={true} />
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Choose Your <span className="text-primary">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join one of our four legendary teams and compete for glory, prizes, and bragging rights!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Team Red",
                color: "red",
                bgColor: "bg-red-500",
                textColor: "text-red-500",
                borderColor: "border-red-500",
                motto: "Fire & Passion",
                members: "485",
                wins: "127"
              },
              {
                name: "Team Yellow",
                color: "yellow", 
                bgColor: "bg-yellow-500",
                textColor: "text-yellow-600",
                borderColor: "border-yellow-500",
                motto: "Lightning Speed",
                members: "423",
                wins: "134"
              },
              {
                name: "Team Green",
                color: "green",
                bgColor: "bg-green-500", 
                textColor: "text-green-500",
                borderColor: "border-green-500",
                motto: "Nature's Force",
                members: "467",
                wins: "119"
              },
              {
                name: "Team Blue",
                color: "blue",
                bgColor: "bg-blue-500",
                textColor: "text-blue-500", 
                borderColor: "border-blue-500",
                motto: "Ocean Deep",
                members: "512",
                wins: "142"
              }
            ].map((team, index) => (
              <div key={index} className={`relative bg-muted/30 backdrop-blur-sm rounded-2xl p-6 border-2 ${team.borderColor} hover:bg-muted/50 transition-all duration-300 transform hover:scale-105 group`}>
                {/* Team Color Badge */}
                <div className={`absolute -top-3 -right-3 w-12 h-12 ${team.bgColor} rounded-full flex items-center justify-center shadow-lg`}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                
                {/* Team Icon */}
                <div className={`text-6xl mb-4 ${team.textColor} transform group-hover:scale-110 transition-transform duration-300`}>
                  {team.color === 'red' && '🔥'}
                  {team.color === 'yellow' && '⚡'}
                  {team.color === 'green' && '🌿'}
                  {team.color === 'blue' && '🌊'}
                </div>
                
                <h3 className={`text-2xl font-bold ${team.textColor} mb-2`}>{team.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 font-medium">{team.motto}</p>
                
                {/* Team Stats */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Members:</span>
                    <span className="font-bold text-foreground">{team.members}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wins:</span>
                    <span className="font-bold text-foreground">{team.wins}</span>
                  </div>
                </div>
                
                <Link to={`/team-${team.color}`}>
                  <Button className={`w-full rounded-full ${team.bgColor} hover:${team.bgColor}/90 text-white border-0`}>
                    View Team
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Can't decide? Don't worry - you can switch teams anytime before major tournaments!
            </p>
            <Link to="/teams">
              <Button variant="outline" size="lg" className="rounded-full">
                View All Teams
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <motion.section 
        className="py-20 bg-slate-900 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="w-full">
          <motion.div 
            className="text-center mb-16 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-black text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our <span className="text-primary">Gallery</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-white/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Capturing unforgettable moments from our adventures and events
            </motion.p>
          </motion.div>
          
          {/* Auto-scrolling gallery - First row (left to right) */}
          <div className="relative mb-8">
            <div className="flex overflow-hidden">
              <motion.div 
                className="flex gap-4 sm:gap-6 min-w-full"
                animate={{ x: [0, -1200] }}
                transition={{ 
                  duration: 25, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                {[
                  { 
                    title: "Community Event", 
                    location: "Event Center", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg", 
                    category: "Community" 
                  },
                  { 
                    title: "Group Activity", 
                    location: "Activity Center", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1679_ovnanp.jpg", 
                    category: "Activities" 
                  },
                  { 
                    title: "Team Building", 
                    location: "Venue", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1684_pv0ohb.jpg", 
                    category: "Team Building" 
                  },
                  { 
                    title: "Social Gathering", 
                    location: "Meeting Hall", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1414_ij80mu.jpg", 
                    category: "Social" 
                  },
                  { 
                    title: "Team Red Champions", 
                    location: "Tournament Hall", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2393_cv5xbp.jpg", 
                    category: "Team Red" 
                  },
                  { 
                    title: "Team Green Adventure", 
                    location: "Nature Park", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915398/_MG_2403_hknyss.jpg", 
                    category: "Team Green" 
                  },
                  { 
                    title: "Team Blue Victory", 
                    location: "Competition Venue", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918906/_MG_2027_oblrvo.jpg", 
                    category: "Team Blue" 
                  },
                  { 
                    title: "Team Yellow in Action", 
                    location: "Event Center", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915401/_MG_2185_rqpdrv.jpg", 
                    category: "Team Yellow" 
                  },
                  { 
                    title: "Event Highlights", 
                    location: "Activity Space", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1424_f0harp.jpg", 
                    category: "Highlights" 
                  },
                  { 
                    title: "Community Fun", 
                    location: "Recreation Center", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1623_olhksw.jpg", 
                    category: "Recreation" 
                  },
                  // Duplicate for seamless loop
                  { 
                    title: "Community Event", 
                    location: "Event Center", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg", 
                    category: "Community" 
                  },
                  { 
                    title: "Group Activity", 
                    location: "Activity Center", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1679_ovnanp.jpg", 
                    category: "Activities" 
                  },
                  { 
                    title: "Team Building", 
                    location: "Venue", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1684_pv0ohb.jpg", 
                    category: "Team Building" 
                  },
                  { 
                    title: "Social Gathering", 
                    location: "Meeting Hall", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1414_ij80mu.jpg", 
                    category: "Social" 
                  }
                ].map((photo, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg min-w-[240px] sm:min-w-[280px] flex-shrink-0 border border-white/20"
                    whileHover={{ 
                      scale: 1.05, 
                      zIndex: 10,
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                      <motion.img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Auto-scrolling gallery - Second row (right to left) */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <motion.div 
                className="flex gap-4 sm:gap-6 min-w-full"
                animate={{ x: [-1200, 0] }}
                transition={{ 
                  duration: 30, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                {[
                  { 
                    title: "Creative Session", 
                    location: "Studio", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1656_yoiklo.jpg", 
                    category: "Creative" 
                  },
                  { 
                    title: "Group Workshop", 
                    location: "Workshop Hall", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1677_v8n5nu.jpg", 
                    category: "Learning" 
                  },
                  { 
                    title: "Community Celebration", 
                    location: "Victory Hall", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1758_mj5kho.jpg", 
                    category: "Celebrations" 
                  },
                  { 
                    title: "Team Collaboration", 
                    location: "Innovation Lab", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1776_eob5jv.jpg", 
                    category: "Collaboration" 
                  },
                  { 
                    title: "Event Background", 
                    location: "Event Space", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/back_k2fwpf.jpg", 
                    category: "Events" 
                  },
                  { 
                    title: "Team Red Strategy", 
                    location: "Conference Room", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918852/_MG_2075_i2peyk.jpg", 
                    category: "Team Red" 
                  },
                  { 
                    title: "Team Green Unity", 
                    location: "Training Center", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2214_zq4dzb.jpg", 
                    category: "Team Green" 
                  },
                  { 
                    title: "Team Blue Achievement", 
                    location: "Awards Ceremony", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915400/_MG_2284_njl6kn.jpg", 
                    category: "Team Blue" 
                  },
                  { 
                    title: "Team Yellow Leadership", 
                    location: "Leadership Hub", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915388/_MG_2118_gi8okx.jpg", 
                    category: "Team Yellow" 
                  },
                  { 
                    title: "Team Red Excellence", 
                    location: "Excellence Center", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915388/_MG_2318_kszvtt.jpg", 
                    category: "Team Red" 
                  },
                  // Duplicate for seamless loop
                  { 
                    title: "Creative Session", 
                    location: "Studio", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1656_yoiklo.jpg", 
                    category: "Creative" 
                  },
                  { 
                    title: "Group Workshop", 
                    location: "Workshop Hall", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1677_v8n5nu.jpg", 
                    category: "Learning" 
                  },
                  { 
                    title: "Community Celebration", 
                    location: "Victory Hall", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1758_mj5kho.jpg", 
                    category: "Celebrations" 
                  },
                  { 
                    title: "Team Collaboration", 
                    location: "Innovation Lab", 
                    image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1776_eob5jv.jpg", 
                    category: "Collaboration" 
                  }
                ].map((photo, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg min-w-[240px] sm:min-w-[280px] flex-shrink-0 border border-white/20"
                    whileHover={{ 
                      scale: 1.05, 
                      zIndex: 10,
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                      <motion.img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Link to="/gallery">
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full border-white text-white hover:bg-white hover:text-slate-900"
              >
                View Full Gallery
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              By The <span className="text-primary">Numbers</span>
            </h2>
            <p className="text-xl text-background/80 max-w-2xl mx-auto">
              Our community continues to grow stronger every day
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "200+", label: "Active Members" },
              { number: "24+", label: "Events Organized" },
              { number: "4", label: "Team Colors" },
              { number: "100%", label: "Fun Guaranteed" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-black text-primary mb-2">{stat.number}</div>
                <div className="text-lg text-background/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              What Our <span className="text-primary">Community Says</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people in our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Adjoa K.",
                role: "Adventure Enthusiast",
                quote: "Games & Connect opened my eyes to a whole new Ghana. From Cape Coast to Kumasi, every adventure teaches me something new about my country and myself.",
                avatar: "👩🏿‍💻",
                pillar: "TRAVEL"
              },
              {
                name: "Kojo M.",
                role: "Tournament Champion",
                quote: "I thought I was good at games until I joined G&C! The competition pushed me to my limits, and I've made amazing friends along the way.",
                avatar: "👨🏿‍🎨",
                pillar: "PLAY"
              },
              {
                name: "Efua A.",
                role: "Community Leader",
                quote: "This community changed my life. I've met my best friends here and found a family that truly cares. G&C is where connections become family.",
                avatar: "👩🏿‍🚀",
                pillar: "CONNECT"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {testimonial.pillar}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   

      {/* Call to Action */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-foreground mb-6">
            Ready to Play, Travel & Connect?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Ghana's most vibrant community where every day is an adventure, every game is a lesson, 
            and every connection is a new beginning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90"
              onClick={() => window.open('/events', '_self')}
            >
              Start Your Adventure
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full text-base px-8 py-6"
              onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    src="https://res.cloudinary.com/drkjnrvtu/image/upload/v1756502369/games_logo_1_gbimmw.svg"
                    alt="Games & Connect"
                    className="h-10 w-auto"
                  />
                
                </div>
                <p className="text-white/80 mb-6 max-w-md leading-relaxed">
                  Ghana's most vibrant community where adventure meets connection. Join us for gaming, travel experiences, and meaningful relationships that last a lifetime.
                </p>
                <div className="mb-6">
                  <h4 className="font-semibold text-primary mb-3">Our Mission</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    To create unforgettable experiences through play, travel, and genuine human connection while celebrating the rich culture of Ghana.
                  </p>
                </div>
                {/* Social Links */}
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-green-600 border-green-500 hover:bg-green-700 text-white"
                    onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                    title="WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 border-transparent hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => window.open('https://www.instagram.com/games_connect_gh/', '_blank')}
                    title="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-blue-600 border-blue-500 hover:bg-blue-700 text-white"
                    onClick={() => window.open('https://www.facebook.com/gamesandconnect', '_blank')}
                    title="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-black border-gray-700 hover:bg-gray-900 text-white"
                    onClick={() => window.open('https://x.com/GamesConnect_gh', '_blank')}
                    title="X (Twitter)"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-black border-gray-700 hover:bg-gray-900 text-white"
                    onClick={() => window.open('https://www.tiktok.com/@games_and_connect', '_blank')}
                    title="TikTok"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-primary mb-4">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link to="/events" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Upcoming Events
                    </Link>
                  </li>

                  <li>
                    <Link to="/community" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link to="/team-red" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Join a Team
                    </Link>
                  </li>

                </ul>
              </div>

              {/* Contact & Info */}
              <div>
                <h4 className="font-semibold text-primary mb-4">Get In Touch</h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Accra, Ghana</span>
                  </li>
                  
                  <li>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white/80 hover:text-primary p-0 h-auto font-normal justify-start"
                      onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                    >
                      Join WhatsApp Community
                    </Button>
                  </li>
                </ul>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h5 className="font-medium text-white mb-3">Community Stats</h5>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">200+</div>
                      <div className="text-white/60">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">48+</div>
                      <div className="text-white/60">Events</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-white/60">
                © 2025 Games & Connect. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm text-white/60">
                <button 
                  onClick={() => alert('Privacy policy coming soon!')}
                  className="hover:text-primary transition-colors duration-200"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => alert('Terms of service coming soon!')}
                  className="hover:text-primary transition-colors duration-200"
                >
                  Terms of Service
                </button>
                <span>•</span>
                <span>Play. Travel. Connect.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
