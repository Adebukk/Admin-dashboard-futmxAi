'use client';

import { useRouter } from 'next/navigation';
import { LogOut, FileUp, BookOpen } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dummyAdminEmail = "staff.admin@futminna.edu.ng"; // Hardcoded for frontend demo
  // const = 
  const handleLogout = () => {
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-center" />
      
      {/* Sidebar */}
      {<>
      <div className={'w-'}>

      </div>
      </>}
      <aside className="hidden w-64 bg-white border-r border-slate-200 p-6 md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-[#0f46ac] -100 rounded-xl">
            <BookOpen className="w-4 h-4 text-[#ffffff]" />
          </div>
          <div>
            <h2 className="font-bold text-[#0f46ac]">Admin Portal</h2>
            {/* <p className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Portal</p> */}
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-72% flex items-center gap-3 px-4 py-3 bg-[#0f46ac] -100 text-[#ffffff] rounded-xl font-semibold">
            <FileUp className="w-5 h-5" />
            Handbooks
          </button>
        </nav>

        <div className="border-t border-slate-200 pt-4 mt-4">
          <p className="text-xs text-slate-500 mb-2 truncate">{dummyAdminEmail}</p>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm font-medium transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}