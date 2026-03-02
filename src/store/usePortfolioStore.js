import { create } from 'zustand'

export const usePortfolioStore = create((set) => ({
  currentSection: 'entry',
  isLoaded: false,
  isExplored: false,
  cameraPosition: [0, 0, 20],
  
  setCurrentSection: (section) => set({ currentSection: section }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  setIsExplored: (explored) => set({ isExplored: explored }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  
  resetToEntry: () => set({ currentSection: 'entry', cameraPosition: [0, 0, 20] }),
}))
