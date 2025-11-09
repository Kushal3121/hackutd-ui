import Select, { components } from 'react-select';
import { X, Check } from 'lucide-react';

export default function CarSelect({ cars, selectedCars, onSelect, onRemove }) {
  const selectedIds = new Set(selectedCars.map((c) => c.id));

  // Custom Option inside dropdown
  const Option = (props) => {
    const { data, innerRef, innerProps, isFocused } = props;
    const isSelected = selectedIds.has(data.value);
    const index = selectedCars.findIndex((c) => c.id === data.value) + 1;
    const carObj = cars.find((c) => c.id === data.value);

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer transition-all ${
          isSelected
            ? 'bg-[#FCE7E7] border border-[#EB0A1E]'
            : isFocused
            ? 'bg-gray-100'
            : 'bg-white'
        }`}
      >
        <div className='flex items-center gap-3'>
          {/* Car Image */}
          {carObj?.media?.hero && (
            <img
              src={carObj.media.hero}
              alt={carObj.name}
              className='w-10 h-6 object-cover rounded'
            />
          )}

          <div className='flex items-center gap-2'>
            {/* Number Badge - Only shown when selected */}
            {isSelected && (
              <span className='inline-flex items-center justify-center bg-[#EB0A1E] text-white text-xs font-semibold rounded-full w-5 h-5 shrink-0'>
                {index}
              </span>
            )}

            {/* Car Name */}
            <span
              className={`text-sm font-medium ${
                isSelected ? 'text-[#EB0A1E]' : 'text-gray-800'
              }`}
            >
              {data.label}
            </span>
          </div>
        </div>

        {/* Right side: X icon (when selected) or Check icon (when hovered) */}
        <div className='flex items-center shrink-0'>
          {isSelected ? (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                onRemove(data.value);
              }}
              className='text-gray-500 hover:text-[#EB0A1E] transition-colors p-1 rounded hover:bg-red-50'
              title='Remove from compare'
            >
              <X size={16} />
            </button>
          ) : (
            <Check
              size={16}
              className={`transition-opacity ${
                isFocused ? 'text-gray-400 opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
      </div>
    );
  };

  // Custom SingleValue display (when dropdown is closed)
  const SingleValue = (props) => {
    const { data } = props;
    const carObj = cars.find((c) => c.id === data.value);
    const index = selectedCars.findIndex((c) => c.id === data.value) + 1;

    return (
      <components.SingleValue {...props}>
        <div className='flex items-center gap-2'>
          {carObj?.media?.hero && (
            <img
              src={carObj.media.hero}
              alt={carObj.name}
              className='w-8 h-5 object-cover rounded'
            />
          )}
          {index > 0 && (
            <span className='inline-flex items-center justify-center bg-[#EB0A1E] text-white text-xs font-semibold rounded-full w-5 h-5 shrink-0'>
              {index}
            </span>
          )}
          <span className='text-gray-900 font-medium text-sm'>
            {data.label}
          </span>
        </div>
      </components.SingleValue>
    );
  };

  // Disable blinking cursor
  const Input = () => null;

  return (
    <Select
      options={cars.map((c) => ({
        value: c.id,
        label: `${c.name} ${c.trim} (${c.year})`,
      }))}
      placeholder='Add car to compare...'
      onChange={(opt) => {
        // Only select if not already selected and under limit
        if (!selectedIds.has(opt.value)) {
          const car = cars.find((c) => c.id === opt.value);
          if (car) onSelect(car);
        }
      }}
      isDisabled={selectedCars.length >= 3}
      components={{ Option, SingleValue, Input }}
      menuShouldScrollIntoView={false}
      menuPlacement='auto'
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: '0.75rem',
          borderColor: state.isFocused ? '#EB0A1E' : '#d1d5db',
          boxShadow: state.isFocused ? '0 0 0 1px #EB0A1E' : 'none',
          width: '400px',
          minHeight: '46px',
          padding: '2px 6px',
          cursor: selectedCars.length >= 3 ? 'not-allowed' : 'pointer',
          fontSize: '0.95rem',
          opacity: selectedCars.length >= 3 ? 0.6 : 1,
        }),
        menu: (base) => ({
          ...base,
          borderRadius: '0.75rem',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          marginTop: 4,
          zIndex: 50,
        }),
        menuList: (base) => ({
          ...base,
          padding: '4px',
        }),
        option: (base) => ({
          ...base,
          padding: 0,
          backgroundColor: 'transparent',
          cursor: 'pointer',
        }),
        singleValue: (base) => ({
          ...base,
          fontWeight: 500,
          color: '#111827',
        }),
        placeholder: (base) => ({
          ...base,
          color: '#9ca3af',
          fontSize: '0.9rem',
        }),
      }}
    />
  );
}
