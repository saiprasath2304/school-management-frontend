import React from 'react';

export default function DataTable({ columns, data, isLoading, emptyMessage = "No data found" }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, idx) => (
                <th key={idx} className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {isLoading ? (
                <tr>
                   <td colSpan={columns.length} className="py-12 text-center text-slate-400 font-medium animate-pulse">
                     Loading data...
                   </td>
                </tr>
             ) : data.length === 0 ? (
                <tr>
                   <td colSpan={columns.length} className="py-12 text-center text-slate-400 font-medium">
                     {emptyMessage}
                   </td>
                </tr>
             ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-brand-50/40 transition-colors">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="py-4 px-6 text-sm text-slate-700">
                         {col.accessor ? row[col.accessor] : col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
