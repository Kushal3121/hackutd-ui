import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useCompareStore = create((set, get) => ({
  items: [],
  toggle: (car) => {
    const items = get().items;
    const exists = items.find((c) => c.id === car.id);
    if (exists) {
      const next = items.filter((c) => c.id !== car.id);
      set({ items: next });
      toast.success('Removed from compare');
      return;
    }
    if (items.length >= 3) {
      toast.error('You can compare up to 3 cars');
      return;
    }
    set({ items: [...items, car] });
    toast.success('Added to compare');
  },
  clear: () => set({ items: [] }),
}));


