// src/components/ui/progress.jsx
import React from 'react';

const Progress = ({ value, className }) => {
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <span className="text-xs font-semibold inline-block py-1 uppercase">{value}%</span>
      </div>
      <div className="flex mb-2">
        <div className="w-full bg-gray-200 rounded-full">
          <div
            className={`bg-blue-500 text-xs font-medium text-center text-white p-0.5 leading-none rounded-full ${className}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export { Progress };
