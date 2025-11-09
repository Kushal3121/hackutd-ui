import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function AccessorySelector({ accentColor, onSelect }) {
  const [selected, setSelected] = useState([]);
  const accessories = [
    { name: "17'' Alloy Wheels", price: 800 },
    { name: 'Sport Pedal Kit', price: 250 },
    { name: 'All-weather Floor Mats', price: 150 },
    { name: 'Rear Spoiler', price: 400 },
  ];

  const toggleAccessory = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );

    if (onSelect) onSelect();
  };

  return (
    <section className='max-w-5xl mx-auto px-6 pb-24 text-center'>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-3xl font-semibold mb-8 text-toyotaGray'
      >
        Add Accessories
      </motion.h2>

      {/* Accessories grid */}
      <div className='grid sm:grid-cols-2 gap-6'>
        {accessories.map((acc, i) => {
          const isSelected = selected.includes(acc.name);
          return (
            <motion.div
              key={acc.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAccessory(acc.name)}
              className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-md'
                  : 'border-gray-200 hover:border-[var(--accent)]'
              }`}
              style={{ '--accent': accentColor }}
            >
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  {acc.name}
                </h3>
                <p className='text-toyotaRed font-medium'>+USD {acc.price}</p>
              </div>

              {isSelected && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className='text-green-600 text-sm mt-2 flex items-center justify-end'
                >
                  <Check size={16} className='mr-1' /> Added
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
