import { supabase } from '../integrations/supabase/client';

/**
 * Check available capacity for an event
 */
export const getEventCapacity = async (eventId: string) => {
  try {
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, total_spots, spots')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return { error: 'Event not found', available: 0, total: 0 };
    }

    // Get all registrations and count manually to avoid TypeScript issues
    const { data: registrations, error: countError } = await (supabase as any)
      .from('registrations')
      .select('payment_status')
      .eq('event_id', eventId);

    if (countError) {
      console.error('Error counting registrations:', countError);
      return { error: 'Error checking capacity', available: 0, total: event.total_spots || 0 };
    }

    const totalSpots = event.total_spots || 0;
    const confirmedRegistrations = registrations?.filter((reg: any) => 
      ['pending', 'paid', 'confirmed'].includes(reg.payment_status)
    ) || [];
    const registeredSpots = confirmedRegistrations.length;
    const availableSpots = Math.max(0, totalSpots - registeredSpots);

    return {
      total: totalSpots,
      registered: registeredSpots,
      available: availableSpots,
      isFull: availableSpots === 0 && totalSpots > 0
    };
  } catch (error) {
    console.error('Error getting event capacity:', error);
    return { error: 'Unknown error', available: 0, total: 0 };
  }
};

/**
 * Check if an email is already registered for an event
 */
export const isEmailRegistered = async (eventId: string, email: string) => {
  try {
    const { data, error } = await (supabase as any)
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email)
      .limit(1);

    if (error) {
      console.error('Error checking email registration:', error);
      return false;
    }

    // Check if any registration has a valid payment status
    const validRegistrations = data?.filter((reg: any) => 
      ['pending', 'paid', 'confirmed'].includes(reg.payment_status)
    ) || [];

    return validRegistrations.length > 0;
  } catch (error) {
    console.error('Error checking email registration:', error);
    return false;
  }
};

/**
 * Get registration statistics for an event
 */
export const getRegistrationStats = async (eventId: string) => {
  try {
    const { data: stats, error } = await (supabase as any)
      .from('registrations')
      .select('payment_status, number_of_participants')
      .eq('event_id', eventId);

    if (error) {
      console.error('Error getting registration stats:', error);
      return {
        pending: 0,
        confirmed: 0,
        paid: 0,
        total_participants: 0
      };
    }

    const result = {
      pending: 0,
      confirmed: 0,
      paid: 0,
      total_participants: 0
    };

    stats?.forEach((registration: any) => {
      const status = registration.payment_status as string;
      const participants = registration.number_of_participants || 1;
      
      if (status === 'pending') result.pending++;
      else if (status === 'confirmed') result.confirmed++;
      else if (status === 'paid') result.paid++;
      
      result.total_participants += participants;
    });

    return result;
  } catch (error) {
    console.error('Error getting registration stats:', error);
    return {
      pending: 0,
      confirmed: 0,
      paid: 0,
      total_participants: 0
    };
  }
};
