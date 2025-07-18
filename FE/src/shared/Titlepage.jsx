/* eslint-disable no-unused-vars */

import { Search } from "./Search";

export function Titlepage({ title, icon: Icon, onSearch }) {
  return (
    <>
      <div className="titlePage bg-white py-2 px-4 flex mb-3 items-center justify-between">
        <div className="title flex items-center">
          <Icon className="text-4xl text-gray-700" />
          <h1 className="text-3xl ms-2 font-bold text-gray-700 ">{title}</h1>
        </div>
        <Search
          onChange={onSearch}
          className={`border border-gray-300 rounded-md`}
        />
      </div>
    </>
  );
}
