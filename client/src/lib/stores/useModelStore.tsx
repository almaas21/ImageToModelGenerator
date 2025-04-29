import { create } from 'zustand';
import { ModelObject } from '../models';

interface ModelState {
  currentModel: ModelObject | null;
  isModelLoading: boolean;
  isModelVisible: boolean;
  
  // Actions
  setCurrentModel: (model: ModelObject | null) => void;
  setModelLoading: (loading: boolean) => void;
  setModelVisible: (visible: boolean) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  currentModel: null,
  isModelLoading: false,
  isModelVisible: false,
  
  setCurrentModel: (model) => set({ currentModel: model }),
  setModelLoading: (loading) => set({ isModelLoading: loading }),
  setModelVisible: (visible) => set({ isModelVisible: visible }),
}));
