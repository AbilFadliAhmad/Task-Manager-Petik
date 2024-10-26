import { useState } from 'react';
import { Checkbox } from '@headlessui/react';

const CheckboxComponent = ({ id, name, checked, onChange }) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      className="group flex items-center"
    >
      <div className="w-4 h-4 border rounded bg-white flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          className="appearance-none"
          onChange={onChange}
        />
        {checked && (
          <svg
            className="w-3 h-3 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </div>
      <span className="ml-2">{name}</span>
    </Checkbox>
  );
};

const MyComponent = () => {
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (id, name) => {
    setCheckedItems(prevItems => {
      if (prevItems.some(item => item.id === id)) {
        return prevItems.filter(item => item.id !== id);
      } else {
        return [...prevItems, { id, name }];
      }
    });
  };

  return (
    <div>
      <CheckboxComponent
        id={1}
        name="checkbox-1"
        checked={checkedItems.some(item => item.id === 1)}
        onChange={() => handleCheckboxChange(1, 'checkbox-1')}
      />
      <CheckboxComponent
        id={2}
        name="checkbox-2"
        checked={checkedItems.some(item => item.id === 2)}
        onChange={() => handleCheckboxChange(2, 'checkbox-2')}
      />
      <CheckboxComponent
        id={3}
        name="checkbox-3"
        checked={checkedItems.some(item => item.id === 3)}
        onChange={() => handleCheckboxChange(3, 'checkbox-3')}
      />

      <div>
        <h3>Checked Items:</h3>
        <pre>{JSON.stringify(checkedItems, null, 2)}</pre>
      </div>
    </div>
  );
};

export default MyComponent;