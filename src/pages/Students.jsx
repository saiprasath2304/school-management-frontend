import React, { useState, useEffect } from 'react';
import { api } from '../api/axios';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { Plus, Search, Loader2 } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    admission_number: '',
    gender: 'M',
    current_class: '',
    date_of_birth: '',
    admission_date: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [searchQuery]);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/api/students/classes/');
      setClasses(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch classes", err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/students/students/', {
        params: { search: searchQuery }
      });
      // Handle Django PageNumberPagination format
      setStudents(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/students/students/', form);
      setIsModalOpen(false);
      setForm({ ...form, first_name: '', last_name: '', admission_number: '', current_class: '' });
      fetchStudents();
    } catch (err) {
      console.error("Failed to create student", err);
      alert("Error saving student. Ensure Admission Number is unique.");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: "Admission No", accessor: "admission_number" },
    { 
      header: "Name", 
      render: (row) => (
        <div className="font-medium text-slate-900">
          {row.first_name} {row.last_name}
        </div>
      )
    },
    { 
      header: "Class", 
      render: (row) => (
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
          {row.current_class_name || 'Unassigned'}
        </span>
      )
    },
    { header: "Gender", accessor: "gender" },
    { 
      header: "Parent Info", 
      render: (row) => (
        <div className="text-sm">
          <div>{row.parent_name || 'N/A'}</div>
          <div className="text-xs text-slate-400">{row.parent_phone}</div>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students Directory</h1>
          <p className="text-slate-500 mt-1">Manage all student records across the school.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Student
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-md">
         <div className="flex items-center pl-3 pr-2 text-slate-400">
            <Search size={18} />
         </div>
         <input 
            type="text"
            placeholder="Search by name or admission number..."
            className="w-full py-2 bg-transparent outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
         />
      </div>

      <DataTable 
        columns={columns} 
        data={students} 
        isLoading={loading}
        emptyMessage="No students found matching your criteria."
      />

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">First Name</label>
              <input required type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
              <input required type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Admission No</label>
              <input required type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" value={form.admission_number} onChange={e => setForm({...form, admission_number: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</label>
              <input required type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Admission Date</label>
              <input required type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500" value={form.admission_date} onChange={e => setForm({...form, admission_date: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Assign Class</label>
            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={form.current_class} onChange={e => setForm({...form, current_class: e.target.value})}>
              <option value="">-- Unassigned --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.grade_name} {c.section}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition">
                Cancel
             </button>
             <button type="submit" disabled={saving} className="flex flex-center px-6 py-2 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition disabled:opacity-70">
                {saving ? <Loader2 className="animate-spin w-5 h-5 mx-2" /> : "Save Student"}
             </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
