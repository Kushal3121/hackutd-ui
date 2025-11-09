import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-toyotaGray-light to-[#F3F3F3] flex flex-col'>
      <Navbar />

      {/* Hero Section */}
      <section className='flex flex-col items-center justify-center flex-1 px-6 text-center text-toyotaGray'>
        {/* Floating gradient orbs */}
        <motion.div
          aria-hidden='true'
          className='absolute -top-24 -left-24 h-64 w-64 bg-toyotaRed/10 rounded-full blur-3xl'
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden='true'
          className='absolute -bottom-24 -right-24 h-72 w-72 bg-red-300/20 rounded-full blur-3xl'
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='max-w-3xl relative'
        >
          <h1 className='text-5xl sm:text-6xl font-extrabold mb-6 leading-tight'>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Discover the Future of{' '}
            </motion.span>
            <motion.span
              className='text-toyotaRed inline-block'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Kynetic Mobility
            </motion.span>
          </h1>

          <p className='text-lg sm:text-xl text-toyotaGray mb-10'>
            Explore, compare, and find your dream Kynetic — powered by
            innovation, designed for every lifestyle.
          </p>

          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to='/signup'
                className='px-8 py-3 bg-toyotaRed text-white font-semibold rounded-lg shadow-md hover:bg-toyotaRed-dark transition'
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to='/login'
                className='px-8 py-3 border-2 border-toyotaRed text-toyotaRed font-semibold rounded-lg hover:bg-toyotaRed hover:text-white transition'
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          aria-hidden='true'
          className='absolute bottom-6 left-1/2 -translate-x-1/2 text-toyotaGray'
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <div className='text-xs tracking-wide'>Scroll</div>
          <div className='mx-auto mt-1 h-5 w-[2px] bg-toyotaRed/70 rounded-full' />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className='text-center text-toyotaGray py-6 text-sm border-t border-toyotaGray-mid'>
        © {new Date().getFullYear()} Kynetic — All Rights Reserved.
      </footer>
    </div>
  );
}
