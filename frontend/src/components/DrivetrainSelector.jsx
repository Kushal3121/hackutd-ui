import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DrivetrainSelector({ car, accentColor, onSelect }) {
  const [selected, setSelected] = useState(null);
  const options = [
    { label: 'Gas', value: 'Gas' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'FWD', value: 'FWD' },
    { label: 'AWD', value: 'AWD' },
  ];

  return (
    <section className='max-w-5xl mx-auto px-6 pb-20 text-center'>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-3xl font-semibold mb-8 text-toyotaGray'
      >
        Choose Powertrain & Drivetrain
      </motion.h2>

      <div className='flex flex-wrap justify-center gap-6'>
        {options.map((opt) => (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelected(opt.value);
              if (onSelect) onSelect();
            }}
            className={`px-6 py-3 rounded-lg border-2 text-lg font-medium transition 
              ${
                selected === opt.value
                  ? 'bg-[var(--accent)] text-white'
                  : 'border-gray-300 hover:border-[var(--accent)]'
              }`}
            style={{ '--accent': accentColor }}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
