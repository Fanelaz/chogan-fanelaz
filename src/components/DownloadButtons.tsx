import React from 'react';
import { FileDown } from 'lucide-react';

export default function DownloadButtons() {
  const handleDownload = (filename: string) => {
    const link = document.createElement('a');
    link.href = `${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Documents utiles
      </h2>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => handleDownload('bon-commande-vierge.pdf')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <FileDown className="h-5 w-5 mr-2" />
          Bon de commande vierge
        </button>
      </div>
    </div>
  );
}