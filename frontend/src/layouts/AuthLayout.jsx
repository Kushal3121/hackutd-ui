export default function AuthLayout({ children }) {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white via-toyotaGray-light to-[#F5F5F5]'>
      <div className='flex items-center justify-center w-full px-4 py-12 sm:px-6 lg:px-8'>
        {children}
      </div>
    </div>
  );
}
