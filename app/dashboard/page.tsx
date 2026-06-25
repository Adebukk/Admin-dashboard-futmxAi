'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FileUp, FileText, CheckCircle, FileCheck } from 'lucide-react';

const FACULTIES = {
  SEET: [
    'Telecommunication Engineering',
    'Mechatronics Engineering',
    'Computer Engineering',
    'Electrical Engineering'
  ],
  SIPET: [
    'Chemical Engineering',
    'Mechanical Engineering',
    'Agricultural and Bio resources Engineering',
    'Petroleum and Gas Engineering',
    'Material and Metallurgical Engineering',
    'Civil Engineering',
    'Food Engineering'
  ]
};

// Defining the shape of our mock data
interface UploadRecord {
  id: number;
  dept: string;
  filename: string;
  date: string;
}

export default function DashboardPage() {
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Local state to hold our fake uploads during the presentation
  const [history, setHistory] = useState<UploadRecord[]>([]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !faculty || !department) return;

    setUploading(true);

    // MOCK UPLOAD DELAY: Pretend it's uploading a large PDF for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Success! Update our fake history list
    const newRecord = {
      id: Date.now(),
      dept: department,
      filename: file.name,
      date: new Date().toLocaleDateString()
    };
    
    setHistory([newRecord, ...history]); // Add to top of list
    toast.success('Handbook uploaded and processed by AI!');
    
    // Reset form
    setFile(null);
    setDepartment('');
    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Upload Handbook</h1>
        <p className="text-slate-500 mt-1">Upload curriculum PDFs to train the AI Assistant.</p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Faculty</label>
            <select required value={faculty} onChange={(e) => {
              setFaculty(e.target.value);
              setDepartment(''); // Reset department when faculty changes
            }} className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none input: text-slate- 700 border-[#0f46acc9] -400">
              <option value="" className='text-slate-700'>-- Choose a faculty --</option>
              <option value="SEET" className='text-slate-700'>SEET</option>
              <option value="SIPET" className='text-slate-700'>SIPET</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Program</label>
            <select required value={department} onChange={(e) => setDepartment(e.target.value)} disabled={!faculty} className="w-full px-4 py-3 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none border-[#0f46acc9] -400 disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">-- Choose a program --</option>
              {faculty && FACULTIES[faculty as keyof typeof FACULTIES].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Handbook File (PDF)</label>
          <label className="block border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#4A2178] -400 transition bg-slate-50 hover:bg-purple-50/50">
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <p className="font-semibold text-slate-700">{file.name}</p>
                <p className="text-xs text-slate-500">Ready to upload</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FileUp className="w-10 h-10 text-[#0f46ac]" />
                <p className="font-semibold text-slate-700">Click to browse files</p>
                <p className="text-xs text-slate-500">Only PDF files are supported</p>
              </div>
            )}
          </label>
        </div>

        <button type="submit" disabled={uploading || !file || !faculty || !department} className="w-full bg-[#0f46ac] text-white py-3 rounded-xl font-semibold hover:bg-[#0f46acc9] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" />
          {uploading ? 'Processing File...' : 'Upload to Database'}
        </button>
      </form>

      {/* History Section (Makes the prototype look alive!) */}
      {history.length > 0 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Uploads (Session)</h2>
          <div className="space-y-3">
            {history.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><FileCheck className="w-5 h-5 text-green-600" /></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{record.dept}</p>
                    <p className="text-xs text-slate-500">{record.filename}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">{record.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}