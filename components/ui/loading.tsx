import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div
      role="status"
      className={`h-full w-full flex items-center justify-center ${className}`}
    >
      <span className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
      <span className="sr-only text-indigo-500">Loading…</span>
    </div>
  );
};

export default Loading;
