import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function InsuranceSelector({ accentColor, onSelect }) {
  const [selected, setSelected] = useState(null);
  const plans = [
    {
      name: 'Basic Coverage',
      desc: 'Covers damage up to $15,000. Ideal for city driving.',
      price: 450,
    },
    {
      name: 'Comprehensive Coverage',
      desc: 'Full damage, theft, and natural disaster protection.',
      price: 850,
    },
    {
      name: 'Premium Coverage',
      desc: 'Includes personal injury protection and roadside assistance.',
      price: 1150,
    },
  ];

  return (
    <section className='max-w-5xl mx-auto px-6 pb-20 text-center'>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-3xl font-semibold mb-6 text-toyotaGray'
      >
        Choose Your Insurance
      </motion.h2>

      <p className='text-gray-600 mb-10'>
        Protect your new Toyota with an insurance plan that fits your needs.
      </p>

      <div className='grid gap-6'>
        {plans.map((p, i) => {
          const isSelected = selected?.name === p.name;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                setSelected(p);
                if (onSelect) onSelect();
              }}
              className={`cursor-pointer border rounded-xl p-5 text-left shadow-sm transition-all duration-300
                ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-md'
                    : 'border-gray-200 hover:border-[var(--accent)]'
                }`}
              style={{ '--accent': accentColor }}
            >
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-lg font-semibold text-toyotaGray'>
                    {p.name}
                  </h3>
                  <p className='text-sm text-gray-500'>{p.desc}</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-semibold text-toyotaRed'>
                    +USD {p.price.toLocaleString()}
                  </p>
                  {isSelected && (
                    <div className='text-green-600 font-medium flex justify-end mt-1'>
                      <Check size={18} className='mr-1' /> Selected
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* No Continue button; parent scrolls immediately after selection */}
    </section>
  );
}
