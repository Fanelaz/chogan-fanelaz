import React, { useState } from 'react';
import { FileDown, ChevronDown, ChevronUp } from 'lucide-react';

export default function DownloadButtons() {
  const [isOpenDocs, setIsOpenDocs] = useState(false);
  const [isOpenLogos, setIsOpenLogos] = useState(false);

  const handleDownload = (filename: string) => {
    const link = document.createElement('a');
    link.href = `${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 space-y-6">
      {/* MENU DOCUMENTS */}
      <div>
        <button
          onClick={() => setIsOpenDocs(!isOpenDocs)}
          className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 hover:text-indigo-700 focus:outline-none"
        >
          Documents
          {isOpenDocs ? (
            <ChevronUp className="w-5 h-5 ml-2" />
          ) : (
            <ChevronDown className="w-5 h-5 ml-2" />
          )}
        </button>

        {isOpenDocs && (
          <div className="mt-4 space-y-3 border-t pt-4">
<button
onClick={() => handleDownload('PetitFlyer.pdf')}
className="inline-flex items-center px-4 py-2 w-full text-left border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
>
<FileDown className="h-5 w-5 mr-2" />
Petit Flyer
</button>
<button
onClick={() => handleDownload('GrandFlyer.pdf')}
className="inline-flex items-center px-4 py-2 w-full text-left border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
>
<FileDown className="h-5 w-5 mr-2" />
Grand Flyer
</button>
<button
onClick={() => handleDownload('bon-commande-vierge.pdf')}
className="inline-flex items-center px-4 py-2 w-full text-left border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
>
<FileDown className="h-5 w-5 mr-2" />
Bon de commande vierge
</button>          </div>
        )}
      </div>

      {/* MENU LOGOS */}
      <div>
        <button
          onClick={() => setIsOpenLogos(!isOpenLogos)}
          className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 hover:text-indigo-700 focus:outline-none"
        >
          Logos
          {isOpenLogos ? (
            <ChevronUp className="w-5 h-5 ml-2" />
          ) : (
            <ChevronDown className="w-5 h-5 ml-2" />
          )}
        </button>

        {isOpenLogos && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <button
              onClick={() => handleDownload('logo.png')}
              className="inline-flex items-center px-4 py-2 w-full text-left border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              <FileDown className="h-5 w-5 mr-2" />
              Logo Transparent
            </button>
            <button
              onClick={() => handleDownload('logo-2.png')}
              className="inline-flex items-center px-4 py-2 w-full text-left border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              <FileDown className="h-5 w-5 mr-2" />
              Logo PNG
            </button>
            {/* Tu peux en ajouter d'autres ici */}
          </div>
        )}
      </div>
    </div>
  );
}



