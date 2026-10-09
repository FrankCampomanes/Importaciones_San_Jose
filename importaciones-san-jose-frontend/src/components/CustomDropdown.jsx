import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Seleccionar...',
  icon: IconComponent,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={`custom-dropdown-container ${className}`} ref={dropdownRef}>
      <button 
        type="button" 
        className={`custom-dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="dropdown-trigger-content">
          {IconComponent && <IconComponent size={15} className="dropdown-trigger-icon" />}
          <span className="dropdown-trigger-label">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={15} className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && (
        <div className="custom-dropdown-menu glass-panel">
          <ul className="dropdown-options-list">
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`dropdown-option-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <div className="option-item-content">
                      {OptionIcon && <OptionIcon size={14} className="option-icon" />}
                      <span className="option-label">{option.label}</span>
                      {option.subLabel && <small className="option-sublabel">{option.subLabel}</small>}
                    </div>
                    {isSelected && <Check size={14} className="option-check-icon" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
