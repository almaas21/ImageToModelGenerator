import { create } from 'zustand';
import { ModelObject } from '../models';

interface ModelState {
  currentModel: ModelObject | null;
  isModelLoading: boolean;
  isModelVisible: boolean;
  loadingMode: 'single-image' | 'multi-angle' | 'text';
  loadingImagesCount: number;
  
  // Actions
  setCurrentModel: (model: ModelObject | null) => void;
  setModelLoading: (loading: boolean) => void;
  setModelVisible: (visible: boolean) => void;
  setLoadingMode: (mode: 'single-image' | 'multi-angle' | 'text') => void;
  setLoadingImagesCount: (count: number) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  currentModel: null,
  isModelLoading: false,
  isModelVisible: false,
  loadingMode: 'single-image',
  loadingImagesCount: 1,
  
  setCurrentModel: (model) => set({ currentModel: model }),
  setModelLoading: (loading) => set({ isModelLoading: loading }),
  setModelVisible: (visible) => set({ isModelVisible: visible }),
  setLoadingMode: (mode) => set({ loadingMode: mode }),
  setLoadingImagesCount: (count) => set({ loadingImagesCount: count }),
}));
