import React from 'react';

export const LoadingSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-16 bg-slate-100 rounded-xl w-full" />
    ))}
  </div>
);
