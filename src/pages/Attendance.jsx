import React, { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { Check, X, Loader2, Save } from 'lucide-react';

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch available classes
    const fetchClasses = async () => {
      try {
        const res = await api.get('/api/students/classes/');
        setClasses(res.data.results || res.data);
        if (res.data.results?.length > 0) {
           setSelectedClass(res.data.results[0].id);
        } else if (res.data.length > 0) {
           setSelectedClass(res.data[0].id);
        }
      } catch (e) {
        console.error("Failed to load classes", e);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && date) {
      loadAttendanceGrid();
    }
  }, [selectedClass, date]);

  const loadAttendanceGrid = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/attendance/class_grid/', {
        params: { classroom: selectedClass, date: date }
      });
      // Returns { date: '...', is_submitted: bool, grid: [{student_id, full_name, status}] }
      setRecords(res.data.grid || []);
    } catch (e) {
      console.error("Failed to load grid", e);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setRecords(records.map(r => 
      r.student_id === studentId ? { ...r, status } : r
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/attendance/bulk_submit/', {
        classroom: selectedClass,
        date: date,
        records: records.map(r => ({ student: r.student_id, status: r.status, remarks: r.remarks || "" }))
      });
      alert("Attendance Saved successfully!");
      loadAttendanceGrid();
    } catch (e) {
      console.error("Save failed", e);
      alert("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daily Attendance</h1>
          <p className="text-slate-500 mt-1">Record and manage attendance for a single class.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || records.length === 0}
          className="flex items-center px-6 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Attendance
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-500 uppercase">Select Class</label>
          <select 
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Choose Class --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.grade_name} {c.section}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-500 uppercase">Select Date</label>
          <input 
            type="date" 
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
             <Loader2 className="animate-spin w-8 h-8 mb-4 text-brand-500" />
             <p>Loading class roster...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No students found in this class, or grid cannot be loaded.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(record => (
                <tr key={record.student_id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-6 text-sm font-medium text-slate-800">
                    {record.full_name}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200">
                      <button 
                        onClick={() => handleStatusChange(record.student_id, 'present')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${record.status === 'present' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => handleStatusChange(record.student_id, 'late')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${record.status === 'late' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                      >
                        Late
                      </button>
                      <button 
                         onClick={() => handleStatusChange(record.student_id, 'absent')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${record.status === 'absent' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
