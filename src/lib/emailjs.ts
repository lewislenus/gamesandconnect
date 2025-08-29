import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_gamesconnect',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_REGISTRATION_TEMPLATE || 'template_event_registration',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key_here',
  REMINDER_TEMPLATE: import.meta.env.VITE_EMAILJS_REMINDER_TEMPLATE || 'template_event_reminder',
  CANCELLATION_TEMPLATE: import.meta.env.VITE_EMAILJS_CANCELLATION_TEMPLATE || 'template_event_cancellation',
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export interface EmailNotificationData {
  to_name: string;
  to_email: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location: string;
  event_price: string;
  registration_date: string;
  confirmation_number: string;
  event_description?: string;
  event_requirements?: string[];
  event_includes?: string[];
  organizer_email?: string;
}

export class EmailService {
  /**
   * Check if EmailJS is properly configured
   */
  static isConfigured(): boolean {
    const config = EMAILJS_CONFIG;
    return !!(
      config.SERVICE_ID && 
      config.SERVICE_ID !== 'service_gamesconnect' &&
      config.PUBLIC_KEY && 
      config.PUBLIC_KEY !== 'your_public_key_here' &&
      config.TEMPLATE_ID && 
      config.TEMPLATE_ID !== 'template_event_registration'
    );
  }

  /**
   * Get configuration status and helpful error messages
   */
  static getConfigurationStatus(): { configured: boolean; message: string } {
    if (!EMAILJS_CONFIG.SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID === 'service_gamesconnect') {
      return {
        configured: false,
        message: 'EmailJS Service ID not configured. Please set VITE_EMAILJS_SERVICE_ID in your environment variables.'
      };
    }

    if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY === 'your_public_key_here') {
      return {
        configured: false,
        message: 'EmailJS Public Key not configured. Please set VITE_EMAILJS_PUBLIC_KEY in your environment variables.'
      };
    }

    if (!EMAILJS_CONFIG.TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID === 'template_event_registration') {
      return {
        configured: false,
        message: 'EmailJS Template ID not configured. Please set VITE_EMAILJS_REGISTRATION_TEMPLATE in your environment variables.'
      };
    }

    return {
      configured: true,
      message: 'EmailJS is properly configured.'
    };
  }

  /**
   * Send event registration confirmation email
   */
  static async sendRegistrationConfirmation(data: EmailNotificationData): Promise<boolean> {
    try {
      // Check if EmailJS is configured
      const configStatus = EmailService.getConfigurationStatus();
      if (!configStatus.configured) {
        console.warn('EmailJS not configured:', configStatus.message);
        return false;
      }

      const templateParams = {
        to_name: data.to_name,
        to_email: data.to_email,
        event_title: data.event_title,
        event_date: data.event_date,
        event_time: data.event_time,
        event_location: data.event_location,
        event_price: data.event_price,
        registration_date: data.registration_date,
        confirmation_number: data.confirmation_number,
        event_description: data.event_description || '',
        event_requirements: data.event_requirements?.join(', ') || 'None specified',
        event_includes: data.event_includes?.join(', ') || 'Details to be provided',
        organizer_email: data.organizer_email || import.meta.env.VITE_ORGANIZER_EMAIL || 'events@gamesandconnect.com',
        reply_to: data.organizer_email || import.meta.env.VITE_ORGANIZER_EMAIL || 'events@gamesandconnect.com',
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return response.status === 200;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send event reminder email (for future use)
   */
  static async sendEventReminder(data: EmailNotificationData): Promise<boolean> {
    try {
      const templateParams = {
        to_name: data.to_name,
        to_email: data.to_email,
        event_title: data.event_title,
        event_date: data.event_date,
        event_time: data.event_time,
        event_location: data.event_location,
        reminder_message: `Don't forget about ${data.event_title} happening on ${data.event_date}!`,
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.REMINDER_TEMPLATE,
        templateParams
      );

      return response.status === 200;
    } catch (error) {
      console.error('Failed to send reminder email:', error);
      return false;
    }
  }

  /**
   * Send event cancellation email (for future use)
   */
  static async sendEventCancellation(data: EmailNotificationData): Promise<boolean> {
    try {
      const templateParams = {
        to_name: data.to_name,
        to_email: data.to_email,
        event_title: data.event_title,
        event_date: data.event_date,
        cancellation_reason: 'Due to unforeseen circumstances',
        refund_info: 'Refunds will be processed within 3-5 business days',
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.CANCELLATION_TEMPLATE,
        templateParams
      );

      return response.status === 200;
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
      return false;
    }
  }

  /**
   * Generate a unique confirmation number
   */
  static generateConfirmationNumber(): string {
    const prefix = 'GC';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Validate email address
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default EmailService;
