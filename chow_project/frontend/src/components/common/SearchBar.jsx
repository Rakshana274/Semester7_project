import React from 'react';

export const SearchBar = ({ value, onChange, placeholder = 'Search...', onClear }) => (
  <div className="position-relative w-100">
    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
    <input
      type="text"
      className="form-control ps-5 pe-4 py-2 rounded-3 border-secondary-subtle"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button 
        type="button" 
        className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted text-decoration-none"
        onClick={onClear || (() => onChange(''))}
      >
        <i className="bi bi-x-lg"></i>
      </button>
    )}
  </div>
);

export default SearchBar;
