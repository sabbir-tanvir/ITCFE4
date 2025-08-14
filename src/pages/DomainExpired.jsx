import React, { useEffect, useState } from 'react';
import { Api_Base_Url } from '../config/api';

const DomainExpired = () => {
  const [supportEmail, setSupportEmail] = useState('');

  useEffect(() => {
    fetch(`${Api_Base_Url}/contact-info/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.support_email) {
          setSupportEmail(data.support_email);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch contact info:', err);
      });
  }, []);

  const handleReload = () => window.location.reload();

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-800 font-hind-siliguri">
            সাইট সাময়িকভাবে <span className="text-[#FE8E3A]" >নিষ্ক্রিয়</span>

          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-hind-siliguri leading-relaxed">
            আপনার ডোমেইনের মেয়াদ শেষ হয়েছে অথবা সাইটটি বর্তমানে অনুমোদিত নয়। 
            অনুগ্রহ করে প্রশাসকের সাথে যোগাযোগ করুন সক্রিয় করার জন্য। সমস্যা সমাধানের পর পুনরায় চেষ্টা করুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleReload}
              className="px-8 py-3 rounded-md shadow-sm bg-[#FE8E3A] hover:bg-amber-600 text-white font-medium font-hind-siliguri transition-colors duration-200"
            >
              পুনরায় লোড করুন
            </button>
            <a
              href={`mailto:${supportEmail || ''}`}
              className="px-8 py-3 rounded-md shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-white hover:bg-gray-50 text-slate-700 font-medium font-hind-siliguri transition-colors duration-200 text-center"
            >
              এডমিনকে ইমেইল
            </a>
          </div>
          <p className="text-sm text-slate-400 font-mono">
            Reference: site not approved 
          </p>
        </div>
        <div className="flex-1 max-w-md mx-auto hidden md:block">

          <img src="/Nooo.gif" alt="Description" className="w-full h-auto rounded-lg " />
        </div>
      </div>
    </section>
  );
};

export default DomainExpired;

