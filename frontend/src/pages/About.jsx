import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import {
  Target,
  Lightbulb,
  Users,
  Award,
  Cpu,
  Shield,
  Zap,
  Globe,
  Code,
  Database,
  Cloud,
  Sparkles,
} from 'lucide-react';

export default function About() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-toyotaGray flex flex-col'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative px-6 pt-32 pb-20 overflow-hidden'>
        {/* Background Pattern */}
        <div
          className='absolute inset-0 opacity-[0.02]'
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Background Accent */}
        <motion.div
          className='absolute top-20 right-0 h-[20rem] w-[20rem] rounded-full bg-[#eb0a1e]/8 blur-[120px]'
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className='max-w-5xl mx-auto text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className='text-5xl sm:text-6xl font-extrabold mb-6 text-black'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              About <span className='text-[#eb0a1e]'>Kynetic</span>
            </motion.h1>

            <motion.p
              className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Reimagining the driving experience through technology and
              innovation. We combine cutting-edge AI, real-time analytics, and
              human-centered design to make every journey safer, smarter, and
              more connected.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className='inline-flex items-center gap-2 px-6 py-3 bg-[#eb0a1e]/10 text-[#eb0a1e] rounded-full font-semibold'
            >
              <Sparkles className='w-5 h-5' />
              Building the Future of Mobility
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <motion.section
        className='py-20 px-6 bg-white'
        initial='hidden'
        animate='visible'
      >
        <div className='max-w-6xl mx-auto'>
          <motion.div
            variants={staggerContainer}
            className='grid md:grid-cols-2 gap-12'
          >
            {[
              {
                icon: Target,
                title: 'Our Mission',
                description:
                  'To revolutionize mobility by creating intelligent, safe, and sustainable transportation solutions that enhance the driving experience for everyone. We believe in leveraging technology to make roads safer and journeys more enjoyable.',
                color: 'from-[#eb0a1e] to-[#d1091b]',
              },
              {
                icon: Lightbulb,
                title: 'Our Vision',
                description:
                  'To become the global leader in connected mobility solutions, where every vehicle is an intelligent companion that anticipates needs, ensures safety, and contributes to a sustainable future for generations to come.',
                color: 'from-[#ff6b6b] to-[#eb0a1e]',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                className='bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100'
              >
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-6`}
                >
                  <item.icon className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-2xl font-bold mb-4 text-black'>
                  {item.title}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Core Values Section */}
      <motion.section
        className='py-20 px-6 bg-gray-50'
        initial='hidden'
        animate='visible'
      >
        <div className='max-w-6xl mx-auto'>
          <motion.div variants={fadeInUp} className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-black'>
              Our Core <span className='text-[#eb0a1e]'>Values</span>
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
              The principles that drive everything we do
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className='grid md:grid-cols-3 gap-8'
          >
            {[
              {
                icon: Users,
                title: 'People First',
                description:
                  'Human-centered design at the core of every decision we make',
              },
              {
                icon: Cpu,
                title: 'Innovation',
                description:
                  'Pushing boundaries with cutting-edge technology and bold ideas',
              },
              {
                icon: Shield,
                title: 'Safety',
                description:
                  'Uncompromising commitment to the safety of every driver and passenger',
              },
              {
                icon: Globe,
                title: 'Sustainability',
                description:
                  'Building solutions that respect our planet and future generations',
              },
              {
                icon: Zap,
                title: 'Excellence',
                description:
                  'Delivering exceptional quality in every product and experience',
              },
              {
                icon: Award,
                title: 'Integrity',
                description:
                  'Operating with transparency, honesty, and ethical standards',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.05 }}
                className='bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center group'
              >
                <div className='inline-flex p-4 rounded-2xl bg-[#eb0a1e]/10 mb-4 group-hover:bg-[#eb0a1e] transition-colors duration-300'>
                  <value.icon className='w-8 h-8 text-[#eb0a1e] group-hover:text-white transition-colors duration-300' />
                </div>
                <h3 className='text-xl font-bold mb-3 text-black'>
                  {value.title}
                </h3>
                <p className='text-gray-600 leading-relaxed text-sm'>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Technology Stack Section */}
      <motion.section
        className='py-20 px-6 bg-white'
        initial='hidden'
        animate='visible'
      >
        <div className='max-w-6xl mx-auto'>
          <motion.div variants={fadeInUp} className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-black'>
              Powered by <span className='text-[#eb0a1e]'>Innovation</span>
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
              Built with cutting-edge technologies to deliver exceptional
              performance
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className='grid grid-cols-2 md:grid-cols-4 gap-6'
          >
            {[
              {
                name: 'React.js',
                icon: Code,
                color: 'from-[#61dafb] to-[#4fa3c7]',
              },
              {
                name: 'Node.js',
                icon: Database,
                color: 'from-[#68a063] to-[#4d7c47]',
              },
              {
                name: 'MongoDB',
                icon: Database,
                color: 'from-[#4db33d] to-[#3d8b2f]',
              },
              {
                name: 'AWS Cloud',
                icon: Cloud,
                color: 'from-[#ff9900] to-[#d97706]',
              },
              {
                name: 'Three.js',
                icon: Cpu,
                color: 'from-[#000000] to-[#374151]',
              },
              {
                name: 'Tailwind CSS',
                icon: Code,
                color: 'from-[#38bdf8] to-[#0ea5e9]',
              },
              {
                name: 'Framer Motion',
                icon: Zap,
                color: 'from-[#c026d3] to-[#9333ea]',
              },
              {
                name: 'AI/ML',
                icon: Cpu,
                color: 'from-[#eb0a1e] to-[#d1091b]',
              },
            ].map((tech, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -5, scale: 1.05 }}
                className='bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group'
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tech.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <tech.icon className='w-6 h-6 text-white' />
                </div>
                <p className='font-semibold text-gray-800 text-sm'>
                  {tech.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className='py-20 px-6 bg-gradient-to-br from-[#eb0a1e] to-[#d1091b] text-white relative overflow-hidden'
        initial='hidden'
        animate='visible'
      >
        {/* Animated Background Elements */}
        <motion.div
          className='absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl'
          animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className='absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl'
          animate={{ x: [50, -50, 50], y: [50, -50, 50] }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        <div className='max-w-6xl mx-auto relative z-10'>
          <motion.div variants={fadeInUp} className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4'>
              Impact by Numbers
            </h2>
            <p className='text-white/90 text-lg max-w-2xl mx-auto'>
              Our journey in transforming mobility
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className='grid grid-cols-2 md:grid-cols-4 gap-8'
          >
            {[
              { value: '2024', label: 'Founded' },
              { value: '15+', label: 'Team Members' },
              { value: '8+', label: 'Technologies' },
              { value: '100%', label: 'Dedication' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.1 }}
                className='text-center'
              >
                <div className='text-5xl font-bold mb-2'>{stat.value}</div>
                <p className='text-white/80 font-medium'>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className='py-20 px-6 bg-white'
        initial='hidden'
        animate='visible'
      >
        <motion.div
          variants={fadeInUp}
          className='max-w-4xl mx-auto text-center'
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-black'>
            Join Us on This Journey
          </h2>
          <p className='text-xl text-gray-600 mb-10 max-w-2xl mx-auto'>
            Be part of the revolution that's shaping the future of mobility.
            Together, we're building something extraordinary.
          </p>
          <motion.div
            className='flex flex-col sm:flex-row justify-center gap-4'
            variants={staggerContainer}
          >
            <motion.button
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-10 py-4 bg-[#eb0a1e] text-white font-bold rounded-lg shadow-xl hover:shadow-2xl hover:bg-[#d1091b] transition-all'
            >
              Get Started
            </motion.button>
            <motion.button
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-10 py-4 border-2 border-[#eb0a1e] text-[#eb0a1e] font-bold rounded-lg hover:bg-[#eb0a1e]/10 transition-all'
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className='bg-white text-gray-600 py-12 border-t border-gray-200'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <h3 className='text-2xl font-bold text-[#eb0a1e] mb-4'>
                Kynetic
              </h3>
              <p className='text-sm leading-relaxed'>
                Pioneering the future of mobility with innovation, quality, and
                sustainability.
              </p>
            </div>
            <div>
              <h4 className='font-bold text-black mb-3'>Company</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Careers
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Press
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-bold text-black mb-3'>Resources</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    API Reference
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Community
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-bold text-black mb-3'>Legal</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-[#eb0a1e] transition'>
                    Licenses
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-300 pt-6 text-center text-sm'>
            <p>
              © {new Date().getFullYear()} Kynetic Mobility Challenge — All
              Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
