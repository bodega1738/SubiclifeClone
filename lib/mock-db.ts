import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import type { 
  User, Partner, Booking, Notification, CounterOffer, MerchantSession 
} from './types'
import { partners as partnersData } from './partners-data'

// --- Types ---

interface MockDBState {
  users: User[]
  partners: Partner[]
  bookings: Booking[]
  notifications: Notification[]
  counter_offers: CounterOffer[]
  merchant_session: MerchantSession | null
  
  // Internal for Realtime
  _subscribers: Array<{
    id: string
    channel: string
    event: string
    table: string
    filter?: string
    callback: (payload: any) => void
  }>
}

interface MockDBActions {
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  addCounterOffer: (offer: CounterOffer) => void
  updateCounterOffer: (id: string, updates: Partial<CounterOffer>) => void
  setMerchantSession: (session: MerchantSession | null) => void
  
  // Realtime internal
  _subscribe: (sub: Omit<MockDBState['_subscribers'][0], 'id'>) => string
  _unsubscribe: (id: string) => void
  _publish: (table: string, event: 'INSERT' | 'UPDATE' | 'DELETE', data: any) => void
}

type MockDBStore = MockDBState & MockDBActions

// --- Initial Data ---

const INITIAL_USERS: User[] = [
  {
    id: 'alfred-id',
    name: 'Alfred',
    email: 'alfred@demo.com',
    tier: 'elite',
    member_id: 'SL-2025-ELITE-1234',
    points: 1000,
    insuranceAmount: 1000000,
    ecoContribution: 500,
    validUntil: new Date('2026-12-31'),
    createdAt: new Date('2024-01-01'),
  }
]

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    user_id: 'alfred-id',
    partner_id: 'lighthouse',
    booking_type: 'hotel',
    booking_details: {
      check_in: '2025-12-24',
      check_out: '2025-12-26',
      room_type: 'Aqua Veranda Suite',
      guests: { adults: 2, children: 0 },
      special_requests: 'Anniversary celebration'
    },
    status: 'pending',
    payment_status: 'pending',
    total_amount: 15000,
    discount_amount: 3750,
    final_amount: 11250,
    created_at: new Date().toISOString(),
  }
]

// --- Store Implementation ---

export const useMockDBStore = create<MockDBStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        users: INITIAL_USERS,
        partners: partnersData,
        bookings: INITIAL_BOOKINGS,
        notifications: [],
        counter_offers: [],
        merchant_session: null,
        _subscribers: [],

        // Actions
        addUser: (user: User) => {
          set((state) => ({ users: [...state.users, user] }))
          get()._publish('users', 'INSERT', user)
        },
        updateUser: (id: string, updates: Partial<User>) => {
          set((state) => ({
            users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
          }))
          const updated = get().users.find(u => u.id === id)
          if (updated) get()._publish('users', 'UPDATE', updated)
        },
        addBooking: (booking: Booking) => {
          set((state) => ({ bookings: [...state.bookings, booking] }))
          get()._publish('bookings', 'INSERT', booking)
        },
        updateBooking: (id: string, updates: Partial<Booking>) => {
          set((state) => ({
            bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)),
          }))
          const updated = get().bookings.find(b => b.id === id)
          if (updated) get()._publish('bookings', 'UPDATE', updated)
        },
        addNotification: (notification: Notification) => {
          set((state) => ({ notifications: [...state.notifications, notification] }))
          get()._publish('notifications', 'INSERT', notification)
        },
        markNotificationRead: (id: string) => {
          set((state) => ({
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          }))
        },
        addCounterOffer: (offer: CounterOffer) => {
          set((state) => ({ counter_offers: [...state.counter_offers, offer] }))
          get()._publish('counter_offers', 'INSERT', offer)
        },
        updateCounterOffer: (id: string, updates: Partial<CounterOffer>) => {
          set((state) => ({
            counter_offers: state.counter_offers.map((o) => (o.id === id ? { ...o, ...updates } : o)),
          }))
          const updated = get().counter_offers.find(o => o.id === id)
          if (updated) get()._publish('counter_offers', 'UPDATE', updated)
        },
        setMerchantSession: (session: MerchantSession | null) => set({ merchant_session: session }),

        // Realtime
        _subscribe: (sub: Omit<MockDBState['_subscribers'][0], 'id'>) => {
          const id = Math.random().toString(36).substring(2, 11)
          set((state) => ({ _subscribers: [...state._subscribers, { ...sub, id }] }))
          return id
        },
        _unsubscribe: (id: string) => {
          set((state) => ({
            _subscribers: state._subscribers.filter((s) => s.id !== id),
          }))
        },
        _publish: (table: string, event: 'INSERT' | 'UPDATE' | 'DELETE', data: any) => {
          const { _subscribers } = get()
          _subscribers.forEach((sub) => {
            if (sub.table === table && (sub.event === '*' || sub.event === event)) {
              // Simple filter parsing: "user_id=eq.alfred-id"
              if (sub.filter) {
                const [col, valPart] = sub.filter.split('=eq.')
                if (data[col] !== valPart) return
              }
              sub.callback({ table, event, new: data, old: event === 'UPDATE' ? data : null })
            }
          })
        },
      }),
      {
        name: 'mock-db',
        storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }),
        partialize: (state) => ({
          users: state.users,
          partners: state.partners,
          bookings: state.bookings,
          notifications: state.notifications,
          counter_offers: state.counter_offers,
          merchant_session: state.merchant_session,
        }),
        skipHydration: true, 
      }
    ),
    { name: 'MockDB' }
  )
)

// --- Supabase API Simulation ---

class QueryBuilder {
  private table: keyof MockDBState
  private filters: Array<(item: any) => boolean> = []
  private orderConfig?: { column: string; ascending: boolean }
  private limitCount?: number
  private joins: Array<{ table: string, alias: string }> = []

  constructor(table: string) {
    this.table = table as keyof MockDBState
  }

  select(columns: string = '*') {
    // Parse joins like '*, partner:partners(*), counter_offer:counter_offers(*)'
    const joinMatches = columns.matchAll(/(\w+):(\w+)\(\*\)/g)
    for (const match of joinMatches) {
      this.joins.push({ alias: match[1], table: match[2] })
    }
    return this
  }

  eq(column: string, value: any) {
    this.filters.push((item: any) => item[column] === value)
    return this
  }

  in(column: string, values: any[]) {
    this.filters.push((item: any) => values.includes(item[column]))
    return this
  }

  order(column: string, { ascending = true } = {}) {
    this.orderConfig = { column, ascending }
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  async single() {
    const { data } = await this.execute()
    const result = data?.[0] || null
    return { data: result, error: result ? null : { message: 'Not found' } }
  }

  async maybeSingle() {
    const { data } = await this.execute()
    return { data: data?.[0] || null, error: null }
  }

  private async execute() {
    const state = useMockDBStore.getState()
    const data = (state[this.table] || []) as any[]
    let filtered = data.filter((item) => this.filters.every((f) => f(item)))

    if (this.orderConfig) {
      const { column, ascending } = this.orderConfig
      filtered.sort((a, b) => {
        if (a[column] < b[column]) return ascending ? -1 : 1
        if (a[column] > b[column]) return ascending ? 1 : -1
        return 0
      })
    }

    if (this.limitCount !== undefined) {
      filtered = filtered.slice(0, this.limitCount)
    }

    // Process joins
    if (this.joins.length > 0) {
      filtered = filtered.map(item => {
        const enriched = { ...item }
        this.joins.forEach(join => {
          // Simplistic join logic: look for partner_id if joining partners
          if (join.table === 'partners') {
            enriched[join.alias] = state.partners.find(p => p.id === item.partner_id)
          } else if (join.table === 'counter_offers') {
            enriched[join.alias] = state.counter_offers.find(o => o.booking_id === item.id)
          }
        })
        return enriched
      })
    } else if (this.table === 'bookings') {
      // Legacy auto-join for compatibility
      filtered = filtered.map(b => ({
        ...b,
        user: state.users.find(u => u.id === b.user_id),
        partner: state.partners.find(p => p.id === b.partner_id)
      }))
    }

    return { data: filtered, error: null }
  }

  // Allow thenable for await supabase.from().select()
  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected)
  }

  async insert(data: any | any[]) {
    const items = Array.isArray(data) ? data : [data]
    const newItems = items.map(item => ({
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      ...item
    }))

    const store = useMockDBStore.getState()
    newItems.forEach(item => {
      if (this.table === 'bookings') store.addBooking(item as Booking)
      else if (this.table === 'users') store.addUser(item as User)
      else if (this.table === 'notifications') store.addNotification(item as Notification)
      else if (this.table === 'counter_offers') store.addCounterOffer(item as CounterOffer)
    })

    return { data: Array.isArray(data) ? newItems : newItems[0], error: null }
  }

  update(updates: any) {
    return {
      eq: (column: string, value: any) => ({
        then: async (resolve: (val: any) => void) => {
          const state = useMockDBStore.getState()
          const data = (state[this.table] || []) as any[]
          const targets = data.filter(item => item[column] === value)
          
          targets.forEach(item => {
            if (this.table === 'bookings') state.updateBooking(item.id, updates)
            else if (this.table === 'users') state.updateUser(item.id, updates)
            else if (this.table === 'counter_offers') state.updateCounterOffer(item.id, updates)
          })

          resolve({ data: targets.length > 0 ? { ...targets[0], ...updates } : null, error: null })
        }
      })
    }
  }
}

class RealtimeChannel {
  private name: string
  private subs: string[] = []

  constructor(name: string) {
    this.name = name
  }

  on(event: string, config: any, callback: (payload: any) => void) {
    const store = useMockDBStore.getState()
    const subId = store._subscribe({
      channel: this.name,
      event: config.event || '*',
      table: config.table,
      filter: config.filter,
      callback
    })
    this.subs.push(subId)
    return this
  }

  subscribe() {
    return this
  }

  unsubscribe() {
    const store = useMockDBStore.getState()
    this.subs.forEach(id => store._unsubscribe(id))
    this.subs = []
  }

  // Internal helper for removeChannel
  _cleanup() {
    this.unsubscribe()
  }
}

const activeChannels = new Map<string, RealtimeChannel>()

export const mockSupabase = {
  from: (table: string) => new QueryBuilder(table),
  
  rpc: async (fn: string, params: any) => {
    const store = useMockDBStore.getState()
    if (fn === 'add_points') {
      const { user_id, points } = params
      const user = store.users.find(u => u.id === user_id)
      if (user) {
        store.updateUser(user_id, { points: (user.points || 0) + points })
        return { data: true, error: null }
      }
    }
    return { data: null, error: { message: `RPC ${fn} not implemented` } }
  },

  channel: (name: string) => {
    const channel = new RealtimeChannel(name)
    // We don't really need a global map for this simple mock but it helps removeChannel
    return channel
  },

  removeChannel: (channel: any) => {
    if (channel && typeof channel.unsubscribe === 'function') {
      channel.unsubscribe()
    }
  }
}

/**
 * Hook to handle hydration for Next.js SSR
 * Usage: const isReady = useHydratedMockDB()
 */
import { useEffect, useState } from 'react'
export function useHydratedMockDB() {
  const [hydrated, setHydrated] = useState(false)
  
  useEffect(() => {
    // Only runs on client
    useMockDBStore.persist.rehydrate()
    setHydrated(true)
  }, [])
  
  return hydrated
}
