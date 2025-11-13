import React from "react";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <input
      className="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default SearchBar;
