import React from 'react';

const JsonPreview: React.FC<{ json: string }> = ({ json }) => {
  return (
    <div className="w-96 bg-white border-l border-gray-200 p-6">
      <div className="h-full">
        <h3 className="text-lg font-semibold mb-4">JSON Preview</h3>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto h-full text-sm font-mono border border-gray-200">
          {json}
        </pre>
      </div>
    </div>
  );
};

export default JsonPreview;