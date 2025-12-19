# Subiclife Standalone Implementation Documentation

This document outlines the transition from Supabase to a Zustand-based mock database for standalone operation.

## Architecture Overview

The application has been decoupled from Supabase by introducing a mock database layer that replicates the Supabase client API. This allows the application to perform CRUD operations, execute RPC-like functions, and handle realtime updates in-memory.

### Key Components

1.  **Mock Database Store (`lib/mock-db.ts`)**
    *   **Technology**: Zustand for state management.
    *   **Storage**: In-memory arrays for `users`, `partners`, `bookings`, `notifications`, and `counter_offers`.
    *   **API Surface**: Replicates Supabase's `.from(table).select().eq()...` pattern.
    *   **Enrichment**: Automatically joins User and Partner data to Booking requests.
    *   **Realtime**: Implements a subscription model where components can listen for table-level changes (INSERT, UPDATE, DELETE).
    *   **RPC Mocking**: Supports `add_points` functionality to update user point balances.

2.  **Mock Data**
    *   **Alfred (Demo User)**: Elite tier, 24,500 points, SL-2025-ELITE-1234.
    *   **Initial Bookings**: 3 pending requests across Hotel, Restaurant, and Yacht categories to demonstrate dashboard functionality.

## File Changes Summary

### Infrastructure
- **`lib/mock-db.ts`**: (New) Created to hold the Zustand store and query builder logic.
- **`package.json`**: Removed `@supabase/supabase-js`.

### Logic & Integration
- **`lib/supabase-actions.ts`**: 
    - Replaced `createClient` with `mockSupabase`.
    - Maintained identical function signatures for `acceptBooking`, `verifyMember`, etc., while switching the underlying data provider.
- **`lib/partners-data.ts`**:
    - Updated `getPartnerById` to query the mock database instead of Supabase.
- **`components/portal/qr-scanner.tsx`**:
    - Integrated with mock actions for member verification and check-in.
- **`components/booking/booking-flow-modal.tsx`**:
    - Updated booking submission to use `mockSupabase.from('bookings').insert()`.
    - Added logic to generate local notifications and award points through mock RPC.
- **`app/portal/dashboard/page.tsx`**:
    - Added mock realtime subscription using `supabase.channel().on().subscribe()`.
    - The dashboard now reacts instantly to new booking submissions.
- **`app/pass/page.tsx`**:
    - Updated data fetching to use the mock client.
    - Implemented mock realtime updates for booking status changes (Confirmation/Decline).

## Verification Steps
1.  **Dependency Removal**: `@supabase/supabase-js` is no longer in `node_modules` or `package.json`.
2.  **Booking Flow**: Submitting a booking from a partner page now triggers a local insert and displays the updated status in the Merchant Dashboard and User Pass immediately.
3.  **Realtime**: Status changes in the Merchant Portal are reflected on the `/pass` page without requiring a manual refresh.
4.  **Points**: Checking in via QR scanner correctly increments the user's points in the mock store.
