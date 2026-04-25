import React, { useState, useEffect } from 'react';
import { api } from '../api/axios';
import DataTable from '../components/ui/DataTable';
import { BookOpen } from 'lucide-react';

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/api/library/books/');
      setBooks(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Book ID", accessor: "book_id" },
    { 
      header: "Title & Author", 
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.title}</div>
          <div className="text-xs text-slate-500">{row.author}</div>
        </div>
      )
    },
    { header: "Category", accessor: "category" },
    { 
       header: "Availability", 
       render: (row) => (
         <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${row.available_copies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {row.available_copies} / {row.total_copies}
         </span>
       )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Library Ledger</h1>
          <p className="text-slate-500 mt-1">Manage school books and inventory availability.</p>
        </div>
      </div>
      <DataTable columns={columns} data={books} isLoading={loading} emptyMessage="No books registered." />
    </div>
  );
}
