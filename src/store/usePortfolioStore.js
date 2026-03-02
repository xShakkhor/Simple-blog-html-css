import { create } from 'zustand'

export const usePortfolioStore = create((set) => ({
  currentSection: 'entry',
  isLoaded: false,
  isExplored: false,
  cameraPosition: [0, 0, 20],
  zoom: 20,
  
  setCurrentSection: (section) => set({ currentSection: section }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  setIsExplored: (explored) => set({ isExplored: explored }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setZoom: (zoom) => set({ zoom: Math.max(5, Math.min(40, zoom)) }),
  
  resetToEntry: () => set({ currentSection: 'entry', cameraPosition: [0, 0, 20], zoom: 20 }),
  zoomIn: () => set((state) => ({ zoom: Math.max(5, state.zoom - 3) })),
  zoomOut: () => set((state) => ({ zoom: Math.min(40, state.zoom + 3) })),
}))
