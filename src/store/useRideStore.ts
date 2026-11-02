import { create } from 'zustand'

interface RideState {
  speed: number // simulation rate multiplier (1 = nominal)
  riding: boolean
  hour: number // time of day, 0-24
  autoTime: boolean
  setSpeed: (speed: number) => void
  toggleRide: () => void
  setHour: (hour: number) => void
  setAutoTime: (on: boolean) => void
}

export const useRideStore = create<RideState>((set) => ({
  speed: 1,
  riding: false,
  hour: 9,
  autoTime: true,
  setSpeed: (speed) => set({ speed }),
  toggleRide: () => set((s) => ({ riding: !s.riding })),
  setHour: (hour) => set({ hour }),
  setAutoTime: (autoTime) => set({ autoTime }),
}))
