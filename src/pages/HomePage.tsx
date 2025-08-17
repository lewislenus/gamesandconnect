import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Play } from 'lucide-react';
import { AutoCarousel } from '@/components/ui/auto-carousel';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" 
        style={{ 
          backgroundColor: '#f7e2dc',
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(217, 104, 70, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(217, 104, 70, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(217, 104, 70, 0.025) 0%, transparent 50%),
            linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.02) 49%, rgba(255, 255, 255, 0.02) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.01) 49%, rgba(255, 255, 255, 0.01) 51%, transparent 52%)
          `,
          backgroundSize: '600px 600px, 800px 800px, 400px 400px, 20px 20px, 20px 20px'
        }}
      >
        {/* Noise overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px'
          }}
        ></div>
        
        {/* Subtle texture pattern */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3Ccircle cx='17' cy='17' r='1'/%3E%3Ccircle cx='37' cy='17' r='1'/%3E%3Ccircle cx='17' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        ></div>
        
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear" 
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0] 
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear" 
          }}
        ></motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-8">
                <motion.h1 
                  className="text-6xl lg:text-8xl font-black text-foreground mb-6 leading-none"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Play. Travel. Connect.
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Join a growing community of young Ghanaians making memories through fun, adventure, and connection. 
                  Experience our exciting events, travel adventures, and build lasting friendships.
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link to="/gallery">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full text-base px-8 py-6"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      See our adventures
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/events">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90"
                    >
                      Join the journey
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Event Info */}
              <motion.div 
                className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-right mb-4">
                  <div className="text-2xl font-bold text-foreground">Next Event</div>
                  <div className="text-lg text-muted-foreground">Two Days in Cape Coast</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Join us for an amazing 2-day adventure to Cape Coast featuring historical tours, 
                  beach fun, and unforgettable memories with the community.
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Hero Auto-Carousel */}
              <motion.div 
                className="aspect-square rounded-3xl overflow-hidden relative shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <AutoCarousel 
                  collection="gallery"
                  autoScrollInterval={5000}
                  className="h-full"
                  imageClassName="object-cover"
                  showControls={false}
                  showDots={false}
                  pauseOnHover={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                <motion.div 
                  className="absolute bottom-6 left-6 right-6 text-white pointer-events-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Play className="w-5 h-5" />
                    </motion.div>
                    <span className="text-sm font-medium">Live the Adventure</span>
                  </div>
                  <p className="text-sm opacity-90">Join Ghana's most vibrant community</p>
                </motion.div>
              </motion.div>
            </motion.div>
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
                  src="https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/cape-coast-flyer_bqx8md.jpg"
                  alt="Two Days in Cape Coast Event Flyer"
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
                    className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(217, 104, 70, 0.7)",
                        "0 0 0 10px rgba(217, 104, 70, 0)",
                        "0 0 0 0 rgba(217, 104, 70, 0)"
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
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">August 22-23, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-sm">Cape Coast, Ghana</span>
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
                Two Days in <span className="text-primary">Cape Coast</span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-muted-foreground leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
              >
                Join us for an unforgettable 2-day adventure exploring Ghana's historic coastal treasures. 
                From the haunting dungeons of Cape Coast Castle to the thrilling canopy walks of Kakum National Park, 
                this journey combines history, nature, and community bonding.
              </motion.p>

              <motion.div 
                className="space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">🏰</span>
                  </div>
                  <span className="text-foreground">Cape Coast Castle & Historical Sites</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">🌳</span>
                  </div>
                  <span className="text-foreground">Kakum National Park Canopy Walk</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">🏖️</span>
                  </div>
                  <span className="text-foreground">Beach Activities & Relaxation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">🤝</span>
                  </div>
                  <span className="text-foreground">Community Bonding & Networking</span>
                </div>
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
                    onClick={() => window.open('/events', '_self')}
                  >
                    Register Now - Limited Spots!
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Early Bird Special:</span>
                  <span className="font-bold text-primary">Save 20% until Aug 18!</span>
                </div>
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

      {/* Upcoming Adventures */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Upcoming <span className="text-primary">Adventures</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From gaming tournaments to weekend getaways, discover your next adventure with us!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Two Days in Cape Coast",
                date: "August 22, 2025",
                time: "7:00 AM",
                location: "Cape Coast, Ghana",
                price: "Contact for pricing",
                image: "🏰",
                category: "TRAVEL"
              },
              {
                title: "Gaming Tournament",
                date: "September 5, 2025",
                time: "3:00 PM",
                location: "Accra",
                price: "GHS 50",
                image: "🎮",
                category: "PLAY"
              },
              {
                title: "Community Networking",
                date: "September 12, 2025",
                time: "6:00 PM",
                location: "East Legon",
                price: "GHS 30",
                image: "🎉",
                category: "CONNECT"
              }
            ].map((event, index) => (
              <div key={index} className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 hover:bg-muted/50 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{event.image}</div>
                  <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {event.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{event.price}</span>
                  <Button 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => window.open('/events', '_self')}
                  >
                    Join Adventure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Collection */}
      <motion.section 
        className="py-20 bg-muted/20 overflow-hidden"
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
                  { name: "Trivia", emoji: "🧠", level: "Beginner" }
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
                    src="https://res.cloudinary.com/drkjnrvtu/image/upload/v1746917075/gameskkc_ytwhpi.png"
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
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                  >
                    <span className="text-lg">💬</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={() => window.open('#', '_blank')}
                  >
                    <span className="text-lg">📸</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={() => window.open('#', '_blank')}
                  >
                    <span className="text-lg">🎬</span>
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
                    <Link to="/gallery" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Photo Gallery
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
                  <li>
                    <Link to="/trivia" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Trivia Night
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
