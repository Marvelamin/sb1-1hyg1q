import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, FileSpreadsheet, Search } from 'lucide-react';
import MainScreen from './components/MainScreen';
import ExcelProcessor from './components/ExcelProcessor';
import { ExcelData } from './types';

function App() {
  const [mainExcel, setMainExcel] = useState<ExcelData[]>([]);
  const [filteredData, setFilteredData] = useState<ExcelData[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProcessor, setShowProcessor] = useState(false);

  useEffect(() => {
    filterData();
  }, [mainExcel, activeTab, searchTerm]);

  const handleMainExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelData[];
        setMainExcel(jsonData);
        setShowProcessor(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const filterData = () => {
    let filtered = mainExcel;

    // Tarihe göre filtreleme
    if (activeTab !== 'all') {
      const currentDate = new Date();
      const startDate = new Date();

      switch (activeTab) {
        case 'year':
          startDate.setFullYear(currentDate.getFullYear() - 1);
          break;
        case 'month':
          startDate.setMonth(currentDate.getMonth() - 1);
          break;
        case 'week':
          startDate.setDate(currentDate.getDate() - 7);
          break;
      }

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.Date); // 'Date' sütununun adını Excel dosyanızdaki gerçek sütun adıyla değiştirin
        return itemDate >= startDate && itemDate <= currentDate;
      });
    }

    // Arama terimine göre filtreleme
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredData(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!showProcessor ? (
        <MainScreen onUpload={handleMainExcelUpload} />
      ) : (
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Excel Veri İşlemcisi</h1>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-2">
                {['all', 'year', 'month', 'week'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded ${
                      activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {tab === 'all' ? 'Tümü' : tab === 'year' ? 'Yıl' : tab === 'month' ? 'Ay' : 'Hafta'}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {filteredData.length > 0 &&
                      Object.keys(filteredData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, valueIndex) => (
                        <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {value.toString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ExcelProcessor mainExcel={mainExcel} setMainExcel={setMainExcel} />
        </div>
      )}
    </div>
  );
}

export default App;