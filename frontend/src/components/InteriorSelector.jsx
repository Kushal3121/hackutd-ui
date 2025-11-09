import { motion } from 'framer-motion';
import { useState } from 'react';

export default function InteriorSelector({ accentColor, onSelect }) {
  const [selected, setSelected] = useState(null);
  const interiors = [
    { name: 'Fabric — Light Gray', price: 0 },
    { name: 'Fabric — Black', price: 250 },
    { name: 'Leather — Beige', price: 750 },
    { name: 'Leather — Black/Red', price: 900 },
  ];

  return (
    <section className='max-w-5xl mx-auto px-6 pb-20 text-center'>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-3xl font-semibold mb-8 text-toyotaGray'
      >
        Choose Interior Trim
      </motion.h2>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center'>
        {interiors.map((int, i) => (
          <motion.div
            key={int.name}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelected(int.name);
              if (onSelect) onSelect();
            }}
            className={`cursor-pointer w-full max-w-[240px] p-5 rounded-xl border-2 transition-all duration-300
              ${
                selected === int.name
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-md'
                  : 'border-gray-200 hover:border-[var(--accent)]'
              }`}
            style={{ '--accent': accentColor }}
          >
            <h3 className='text-lg font-semibold text-gray-700'>{int.name}</h3>
            <p className='text-toyotaRed font-medium mt-2'>
              +USD {int.price.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
