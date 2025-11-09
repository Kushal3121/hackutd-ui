import { motion } from 'framer-motion';

export default function SummarySection({ car, accentColor, selectedColor }) {
  return (
    <section className='max-w-4xl mx-auto text-center py-20'>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-3xl font-semibold mb-6 text-toyotaGray'
      >
        Your Build Summary
      </motion.h2>

      <div className='bg-white/90 shadow-lg rounded-2xl p-8 space-y-4'>
        <p>
          <strong>Model:</strong> {car.name} {car.trim} ({car.year})
        </p>
        <p>
          <strong>Color:</strong> {selectedColor?.name}
        </p>
        <p>
          <strong>Powertrain:</strong> {car.powertrain}
        </p>
        <p>
          <strong>Drivetrain:</strong> {car.drivetrain}
        </p>
        <p>
          <strong>Base MSRP:</strong> {car.currency} {car.msrp.toLocaleString()}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='mt-10 px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold shadow-md'
        style={{ '--accent': accentColor }}
      >
        Book a Test Drive
      </motion.button>
    </section>
  );
}
