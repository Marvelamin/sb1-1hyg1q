import React from 'react';
import { Upload } from 'lucide-react';

interface MainScreenProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ onUpload }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Excel Veri İşlemcisi</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-center mb-6 text-gray-600">
          Başlamak için ana Excel dosyanızı yükleyin.
        </p>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="mainExcel" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
              <p className="text-xs text-gray-500">XLSX, XLS</p>
            </div>
            <input id="mainExcel" type="file" className="hidden" onChange={onUpload} accept=".xlsx,.xls" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;