import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
import SEO from '@/components/SEO';
import { Footer } from '@/components/Footer';

const ContactUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Initialize EmailJS with public key
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      
      // You'll need to create a contact form template in EmailJS
      // For now, we'll use the admin notification template as fallback
      const templateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE || import.meta.env.VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE;

      if (!publicKey || !serviceId || !templateId) {
        throw new Error('Email service not configured');
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        to_email: import.meta.env.VITE_ORGANIZER_EMAIL || 'events@gamesandconnect.com',
        to_name: 'Games & Connect Team',
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSubmitted(true);
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We\'ll get back to you soon!',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again or email us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us"
        description="Get in touch with Games & Connect. We're here to answer your questions about events, community activities, and more."
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Have a question or want to learn more? We'd love to hear from you!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1 space-y-6">
              {/* Contact Cards */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-orange-500/20">
                      <Mail className="h-5 w-5 text-orange-400" />
                    </div>
                    <CardTitle className="text-white">Email Us</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <a 
                    href={`mailto:${import.meta.env.VITE_ORGANIZER_EMAIL || 'events@gamesandconnect.com'}`}
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {import.meta.env.VITE_ORGANIZER_EMAIL || 'events@gamesandconnect.com'}
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-500/20">
                      <Phone className="h-5 w-5 text-green-400" />
                    </div>
                    <CardTitle className="text-white">Call Us</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <a 
                    href="tel:+233505891665"
                    className="text-green-400 hover:text-green-300 transition-colors text-lg font-semibold block mb-2"
                  >
                    +233 50 589 1665
                  </a>
                  <p className="text-slate-300">Available Monday - Friday</p>
                  <p className="text-slate-300">9:00 AM - 6:00 PM</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-500/20">
                      <MapPin className="h-5 w-5 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">Visit Us</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">
                    Community events across multiple locations
                  </p>
                  <p className="text-slate-300 mt-2">
                    Check our Events page for specific venues
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Card */}
              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Quick Help</CardTitle>
                  <CardDescription className="text-slate-300">
                    Need immediate assistance?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-slate-300">
                    • Check our{' '}
                    <a href="/events" className="text-orange-400 hover:text-orange-300">
                      Events
                    </a>{' '}
                    page for schedules
                  </p>
                  <p className="text-sm text-slate-300">
                    • View your{' '}
                    <a href="/my-registrations" className="text-orange-400 hover:text-orange-300">
                      Registrations
                    </a>
                  </p>
                  <p className="text-sm text-slate-300">
                    • Learn about our{' '}
                    <a href="/community" className="text-orange-400 hover:text-orange-300">
                      Community
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
                  <CardDescription className="text-slate-300">
                    Fill out the form below and we'll respond as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in">
                      <div className="p-4 rounded-full bg-green-500/20">
                        <CheckCircle className="h-16 w-16 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                      <p className="text-slate-300 text-center max-w-md">
                        Thank you for reaching out. We'll get back to you within 24-48 hours.
                      </p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-slate-300">
                            Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-slate-300">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-slate-300">
                            Phone (Optional)
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="(123) 456-7890"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium text-slate-300">
                            Subject *
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="What's this about?"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-slate-300">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-slate-400 text-center">
                        By submitting this form, you agree to our privacy policy and terms of service.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;

