import { create } from 'zustand';

interface UploadState {
  uploadMode: 'image' | 'text';
  
  // Actions
  setUploadMode: (mode: 'image' | 'text') => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploadMode: 'image',
  
  setUploadMode: (mode) => set({ uploadMode: mode }),
}));
