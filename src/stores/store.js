import { create } from 'zustand';
import { uiStore } from './ui/uiStore';

export const useUiStore = create(uiStore);
