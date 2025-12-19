
import { mockSupabase as supabase } from '@/lib/mock-db'
import { AcceptData, DeclineData, CounterOfferData } from '@/lib/types'

export async function acceptBooking(
  bookingId: string,
  partnerId: string,
  userId: string,
  partnerName: string,
  acceptData: AcceptData
) {
  // Update booking status
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      // Store assignment in booking_details if needed, assuming the column supports JSONB update or similar
      // For now, we just update status as per instructions, but let's see if we should store the room/table
    })
    .eq('id', bookingId)

  if (bookingError) throw bookingError

  // Create notification for user
  await supabase.from('notifications').insert({
    user_id: userId,
    partner_id: partnerId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed!',
    message: `Your booking at ${partnerName} has been confirmed. ${acceptData.roomOrTable ? `Assigned: ${acceptData.roomOrTable}` : ''}`,
    read: false
  })

  // Award points (500 for confirmed booking)
  await supabase.rpc('add_points', {
    user_id: userId,
    points: 500
  })
}

export async function declineBooking(
  bookingId: string,
  partnerId: string,
  userId: string,
  partnerName: string,
  declineData: DeclineData
) {
  // Update booking status
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({
      status: 'declined',
      // Store decline reason if needed
    })
    .eq('id', bookingId)

  if (bookingError) throw bookingError

  // Create notification for user
  await supabase.from('notifications').insert({
    user_id: userId,
    partner_id: partnerId,
    type: 'booking_declined',
    title: 'Booking Update',
    message: `Your booking at ${partnerName} was declined: ${declineData.explanation}`,
    read: false
  })
}

export async function sendCounterOffer(
  bookingId: string,
  partnerId: string,
  userId: string,
  partnerName: string,
  offerDetails: CounterOfferData,
  merchantNote: string
) {
  // Insert counter offer
  const { error: offerError } = await supabase.from('counter_offers').insert({
    booking_id: bookingId,
    partner_id: partnerId,
    offer_details: offerDetails,
    merchant_note: merchantNote,
    status: 'pending',
    created_at: new Date().toISOString()
  })

  if (offerError) throw offerError

  // Update booking status
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({
      status: 'counter_offer_sent'
    })
    .eq('id', bookingId)

  if (bookingError) throw bookingError

  // Create notification for user
  await supabase.from('notifications').insert({
    user_id: userId,
    partner_id: partnerId,
    type: 'counter_offer',
    title: 'Counter-Offer Received',
    message: `${partnerName} has a suggestion regarding your booking request.`,
    read: false
  })
}

export async function verifyMember(memberId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('member_id', memberId)
    .single()
  
  if (error) throw error
  return data
}

export async function getConfirmedBooking(userId: string, partnerId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, partners(*)')
    .eq('user_id', userId)
    .eq('partner_id', partnerId)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (error) throw error
  return data
}

export async function checkInBooking(bookingId: string, userId: string) {
  // Update booking status
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ 
      status: 'completed',
      checked_in_at: new Date().toISOString()
    })
    .eq('id', bookingId)

  if (bookingError) throw bookingError

  // Award points using RPC
  const { error: pointsError } = await supabase
    .rpc('add_points', { 
      user_id: userId, 
      points_to_add: 100 
    })

  if (pointsError) {
    console.error('Error awarding points:', pointsError)
    // Don't throw here to ensure check-in is still considered successful
  }

  // Create notification for user
  const { error: notificationError } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title: 'Check-in Successful',
      message: 'You have successfully checked in and earned 100 points!',
      type: 'check_in'
    })

  if (notificationError) {
    console.error('Error creating notification:', notificationError)
  }

  return { success: true }
}

export async function acceptCounterOffer(
  bookingId: string,
  offerId: string,
  userId: string,
  partnerId: string
) {
  // Update counter offer status
  const { error: offerError } = await supabase
    .from('counter_offers')
    .update({ status: 'accepted' })
    .eq('id', offerId)

  if (offerError) throw offerError

  // Fetch offer details to update booking
  const { data: offerData, error: fetchError } = await supabase
    .from('counter_offers')
    .select('offer_details')
    .eq('id', offerId)
    .single()

  if (fetchError) throw fetchError

  // Update booking status and details
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({
      status: 'confirmed',
      booking_details: offerData.offer_details,
      final_amount: offerData.offer_details.price || undefined,
      confirmed_at: new Date().toISOString()
    })
    .eq('id', bookingId)

  if (bookingError) throw bookingError

  // Create notification for partner
  await supabase.from('notifications').insert({
    partner_id: partnerId,
    user_id: userId,
    type: 'counter_offer_accepted',
    title: 'Counter-Offer Accepted',
    message: 'The user has accepted your counter-offer.',
    read: false
  })

  // Award points (500 for confirmed booking)
  await supabase.rpc('add_points', {
    user_id: userId,
    points_to_add: 500
  })

  return { success: true }
}

export async function declineCounterOffer(
  bookingId: string,
  offerId: string,
  userId: string,
  partnerId: string
) {
  // Update counter offer status
  const { error: offerError } = await supabase
    .from('counter_offers')
    .update({ status: 'declined' })
    .eq('id', offerId)

  if (offerError) throw offerError

  // Update booking status back to pending
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'pending' })
    .eq('id', bookingId)

  if (bookingError) throw bookingError

  // Create notification for partner
  await supabase.from('notifications').insert({
    partner_id: partnerId,
    user_id: userId,
    type: 'counter_offer_declined',
    title: 'Counter-Offer Declined',
    message: 'The user has declined your counter-offer. The booking request is back to pending.',
    read: false
  })

  return { success: true }
}

export async function cancelBooking(
  bookingId: string,
  userId: string,
  partnerId: string,
  reason: string,
  note: string
) {
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancellation_details: { reason, note, cancelled_at: new Date().toISOString() }
    })
    .eq('id', bookingId)

  if (bookingError) throw bookingError

  // Create notification for partner
  await supabase.from('notifications').insert({
    partner_id: partnerId,
    user_id: userId,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: `A booking has been cancelled. Reason: ${reason}`,
    read: false
  })

  return { success: true }
}
