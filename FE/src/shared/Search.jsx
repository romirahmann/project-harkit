/* eslint-disable no-unused-vars */
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export function Search({
  value = "",
  onChange,
  placeholder = "Search ...",
  className,
}) {
  const [query, setQuery] = useState(value);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className=" relative">
      <input
        type="text"
        placeholder={`${placeholder}`}
        value={query}
        name="search"
        onChange={handleChange}
        className={`${className} py-3 ps-9 px-2 `}
      />
      <FaSearch className="absolute top-4 left-3 text-gray-400" />
    </div>
  );
}
