export default function AuthLayout({ children }) {
  return (
    <div className='relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f9f9f9] via-[#f3f3f3] to-[#e9e9e9]'>
      {/* floating background gradient lights */}
      <div className='absolute -top-32 -left-32 w-[400px] h-[400px] bg-toyotaRed/20 rounded-full blur-[120px] animate-move-slow' />
      <div className='absolute bottom-[-200px] right-[-150px] w-[450px] h-[450px] bg-[#808080]/20 rounded-full blur-[140px] animate-move-slower' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_60%)] opacity-70 pointer-events-none' />

      {/* moving light overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gradient-move opacity-60' />

      {/* main content */}
      <div className='relative z-10 flex items-center justify-center w-full px-4 py-12 sm:px-6 lg:px-8'>
        {children}
      </div>
    </div>
  );
}
