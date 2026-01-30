
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onBulkImport?: () => void;
  onAdd?: () => void;
}

const DataTable = <T,>({ data, columns, title, onEdit, onDelete, onBulkImport, onAdd }: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredData = data.filter((item) => {
    const searchValues = Object.values(item as object).join(' ').toLowerCase();
    return searchValues.includes(searchQuery.toLowerCase());
  });

  const handleCopy = (item: any, id: string) => {
    // Format the text beautifully for human reading
    let formattedText = `EORVEX REGISTRY ENTRY: ${title}\n`;
    formattedText += `-----------------------------------\n`;
    
    columns.forEach(col => {
      const val = item[col.key];
      formattedText += `${col.label}: ${val || 'N/A'}\n`;
    });
    
    formattedText += `-----------------------------------\n`;
    formattedText += `Generated at: ${new Date().toLocaleString()}`;

    navigator.clipboard.writeText(formattedText).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Toolbar */}
      <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            {data.length} Total Records
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 w-full md:w-64">
            <ICONS.Search className="w-4 h-4 text-zinc-600 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-700 w-full outline-none text-white"
            />
          </div>
          {onBulkImport && (
            <button 
              onClick={onBulkImport}
              className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-cyan-400 rounded-xl transition-all"
              title="Bulk Import"
            >
              <ICONS.FileUp className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={onAdd}
            className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-xl transition-all"
          >
            <ICONS.Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/50">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/20 transition-colors group">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] || '-')}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit?.(item)}
                        className="p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-cyan-400 rounded-lg transition-all shadow-sm"
                        title="Edit Entry"
                      >
                        <ICONS.Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleCopy(item, String(idx))}
                        className="p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-emerald-400 rounded-lg transition-all shadow-sm relative overflow-visible"
                        title="Copy Data"
                      >
                        <ICONS.Copy className={`w-4 h-4 ${copiedId === String(idx) ? 'animate-pulse' : ''}`} />
                        {copiedId === String(idx) && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap z-50">
                            Copied!
                          </div>
                        )}
                      </button>
                      <button 
                        onClick={() => onDelete?.(item)}
                        className="p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 rounded-lg transition-all shadow-sm"
                        title="Delete Entry"
                      >
                        <ICONS.Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center gap-3">
                     <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-700">
                        <ICONS.Search className="w-6 h-6" />
                     </div>
                     <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">No matching records found</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Showing {filteredData.length > 0 ? 1 : 0} to {filteredData.length} of {filteredData.length}</span>
        <div className="flex gap-2">
           <button className="p-1.5 rounded-lg border border-zinc-800 text-zinc-600 hover:text-white disabled:opacity-30" disabled>
             <ICONS.ChevronLeft className="w-4 h-4" />
           </button>
           <button className="px-3 py-1 rounded-lg bg-zinc-800 text-cyan-400 text-[10px] font-bold">1</button>
           <button className="p-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-white disabled:opacity-30" disabled>
             <ICONS.ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
