import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-md border-b border-toyotaGray-mid'
          : 'bg-white/70 backdrop-blur-lg border-b border-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
        {/* Logo */}
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => setOpen(false)}
        >
          <img
            src='/logo.png'
            alt='Kynetic'
            className='h-8 w-8 object-contain rounded-sm'
          />
          <span className='text-2xl font-extrabold text-toyotaRed tracking-tight hover:text-toyotaRed-dark transition'>
            KYNETIC
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className='hidden sm:flex items-center space-x-8'>
          <div className='relative'>
            <Link
              to='/'
              className={`font-medium relative ${
                isActive('/')
                  ? 'text-toyotaRed'
                  : 'text-toyotaGray hover:text-toyotaRed'
              }`}
            >
              Home
            </Link>
            <AnimatePresence>
              {isActive('/') && (
                <motion.div
                  layoutId='active-underline'
                  className='h-[2px] bg-toyotaRed rounded-full absolute -bottom-1 left-0 right-0'
                />
              )}
            </AnimatePresence>
          </div>

          <div className='relative'>
            <Link
              to='/about'
              className={`font-medium relative ${
                isActive('/about')
                  ? 'text-toyotaRed'
                  : 'text-toyotaGray hover:text-toyotaRed'
              }`}
            >
              About
            </Link>
            <AnimatePresence>
              {isActive('/about') && (
                <motion.div
                  layoutId='active-underline'
                  className='h-[2px] bg-toyotaRed rounded-full absolute -bottom-1 left-0 right-0'
                />
              )}
            </AnimatePresence>
          </div>

          <div className='flex items-center space-x-3'>
            <Link
              to='/login'
              className='px-5 py-2 bg-toyotaRed text-white font-medium rounded-lg shadow-md hover:bg-toyotaRed-dark transition'
            >
              Sign In
            </Link>

            <Link
              to='/signup'
              className='px-5 py-2 border border-toyotaRed text-toyotaRed font-medium rounded-lg hover:bg-toyotaRed hover:text-white transition'
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className='sm:hidden text-toyotaGray focus:outline-none'
          onClick={() => setOpen(!open)}
          aria-label='Toggle menu'
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='sm:hidden bg-white/95 backdrop-blur-lg shadow-md border-t border-toyotaGray-mid'
          >
            <div className='flex flex-col space-y-4 py-4 px-6'>
              <Link
                to='/'
                className={`font-medium ${
                  isActive('/')
                    ? 'text-toyotaRed'
                    : 'text-toyotaGray hover:text-toyotaRed'
                }`}
                onClick={() => setOpen(false)}
              >
                Home
              </Link>

              <Link
                to='/about'
                className={`font-medium ${
                  isActive('/about')
                    ? 'text-toyotaRed'
                    : 'text-toyotaGray hover:text-toyotaRed'
                }`}
                onClick={() => setOpen(false)}
              >
                About
              </Link>

              <Link
                to='/login'
                className='px-4 py-2 bg-toyotaRed text-white font-medium rounded-lg hover:bg-toyotaRed-dark transition text-center'
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>

              <Link
                to='/signup'
                className='px-4 py-2 border border-toyotaRed text-toyotaRed font-medium rounded-lg hover:bg-toyotaRed hover:text-white transition text-center'
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
