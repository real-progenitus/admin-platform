'use client';

import React from 'react';
import { useEnvironment } from '../contexts/EnvironmentContext';

export function EnvironmentSelector() {
  const { environment, setEnvironment } = useEnvironment();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="environment-select" className="text-sm font-medium text-gray-700">
        Environment:
      </label>
      <select
        id="environment-select"
        value={environment}
        onChange={(e) => setEnvironment(e.target.value as 'production' | 'qa')}
        className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option value="production">Production</option>
        <option value="qa">QA</option>
      </select>
    </div>
  );
}
