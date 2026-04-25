import React, { useState, useEffect } from 'react';
import { api } from '../api/axios';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { BadgeDollarSign, Plus, Loader2 } from 'lucide-react';

export default function Fees() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await api.get('/api/fees/receipts/');
      setReceipts(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Receipt No", accessor: "receipt_number" },
    { 
      header: "Student", 
      render: (row) => row.student_name || `Student ID: ${row.student}`
    },
    { 
      header: "Amount Paid", 
      render: (row) => <span className="font-medium text-emerald-600">${row.amount_paid}</span>
    },
    { header: "Payment Mode", accessor: "payment_mode" },
    { header: "Payment Date", accessor: "payment_date" },
    {
      header: "Download",
      render: (row) => (
        <a 
           href={`${api.defaults.baseURL}/api/fees/receipts/${row.id}/download_pdf/`} 
           target="_blank" rel="noopener noreferrer"
           className="text-brand-600 hover:text-brand-800 font-medium text-sm transition"
        >
          📄 PDF
        </a>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fee Management</h1>
          <p className="text-slate-500 mt-1">Track payments and download digital receipts.</p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={receipts} 
        isLoading={loading}
        emptyMessage="No fee receipts recorded yet."
      />
    </div>
  );
}
