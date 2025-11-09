import { useState } from 'react';
import { Search } from 'lucide-react';
import { parseCommand } from '../utils/commandParser';

export default function SmartSearchInput({ onParsed }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = parseCommand(text);
    onParsed?.(result);
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-3xl'>
      <div className='relative'>
        <Search
          className='absolute left-3 top-2.5 text-toyotaGray-mid pointer-events-none'
          size={18}
        />
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Try: "hybrid suv under 30k in canada"'
          className='w-full border border-toyotaGray-mid rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-toyotaRed-light focus:outline-none bg-white'
        />
      </div>
    </form>
  );
}
