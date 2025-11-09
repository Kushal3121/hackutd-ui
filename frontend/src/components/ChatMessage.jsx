export default function ChatMessage({ role = 'assistant', children }) {
  const isUser = role === 'user';
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} my-1`}>
      <div
        className={`max-w-[80%] rounded-md px-3 py-2 shadow-sm border
          ${isUser
            ? 'bg-gray-800 text-white border-gray-800'
            : 'bg-white text-gray-900 border-[#E5E7EB]'}
        `}
        style={!isUser ? { borderLeft: '4px solid #EB0A1E' } : undefined}
      >
        <div className='text-sm leading-relaxed'>{children}</div>
      </div>
    </div>
  );
}


