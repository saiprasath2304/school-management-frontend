import React, { useState, useEffect } from 'react';
import { api } from '../api/axios';
import DataTable from '../components/ui/DataTable';
import { FileCheck } from 'lucide-react';

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/api/exams/exams/');
      setExams(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Exam Name", accessor: "name" },
    { 
      header: "Academic Term", 
      render: (row) => <span className="font-medium text-slate-600">{row.academic_year_name || row.term || 'Term 1'}</span>
    },
    { header: "Start Date", accessor: "start_date" },
    { header: "End Date", accessor: "end_date" },
    { 
       header: "Status", 
       render: (row) => (
          row.is_published 
            ? <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">Published</span>
            : <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold">Draft</span>
       )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Examinations & Results</h1>
          <p className="text-slate-500 mt-1">Configure grading periods and track academic evaluations.</p>
        </div>
      </div>
      <DataTable columns={columns} data={exams} isLoading={loading} emptyMessage="No active examination cycles." />
    </div>
  );
}
