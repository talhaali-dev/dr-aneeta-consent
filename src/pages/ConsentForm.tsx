import React, { useState } from 'react';
import { Link } from 'react-router';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function ConsentForm() {
  const [participantName, setParticipantName] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const [signatureFont, setSignatureFont] = useState("'Caveat', cursive");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('You must agree to the consent form.');
      return;
    }
    if (!signatureText.trim()) {
      alert('Please type your signature.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Generate signature image from text and font
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      let signatureDataUrl = '';
      
      if (ctx) {
        ctx.font = `36px ${signatureFont}`;
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'middle';
        ctx.fillText(signatureText, 10, 50);
        signatureDataUrl = canvas.toDataURL('image/png');
      }

      // Auto-generate Participant Code for Study 1 (e.g., P-001)
      const collRef = collection(db, 'consents');
      const allDocs = await getDocs(collRef);
      const caregiverDocs = allDocs.docs.filter(d => {
        const data = d.data();
        return !data.studyId || data.studyId === 'caregiver-burden';
      });
      const nextIdNumber = caregiverDocs.length + 1;
      const autoParticipantCode = `P-${String(nextIdNumber).padStart(3, '0')}`;
      
      // Save to Firebase
      await addDoc(collRef, {
        studyId: 'caregiver-burden',
        studyTitle: 'Assessing Cancer Caregiver Burden',
        participantCode: autoParticipantCode,
        participantName,
        date,
        signature: signatureDataUrl,
        createdAt: serverTimestamp()
      });

      // Redirect to Google Form
      const googleFormBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeeN09XyddfeBKge4DL7hfkc-a981UI2jmmzXtClfzVMm46nQ/viewform";
      const prefillUrl = `${googleFormBaseUrl}?usp=pp_url&entry.451770697=${encodeURIComponent(autoParticipantCode)}`;
      
      // Open the prefilled URL in a new tab
      window.open(prefillUrl, '_blank', 'noopener,noreferrer');
      
      // Reset submission state and form so it doesn't get stuck
      setIsSubmitting(false);
      setParticipantName('');
      setDate('');
      setSignatureText('');
      setAgreed(false);
      
    } catch (error) {
      console.error("Error saving document: ", error);
      alert('There was an error saving the consent form. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 mb-16">
      {/* Navigation & Study Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-blue-50/70 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 transition-colors bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-xs"
          >
            ← All Studies
          </Link>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-600 text-white">
            Study 1
          </span>
          <span className="text-xs font-medium text-blue-900 hidden sm:inline">
            Cancer Caregiver Burden Study
          </span>
        </div>

        <Link
          to="/study/health-literacy"
          className="text-xs text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1"
        >
          Looking for Health Literacy Study? Switch to Study 2 →
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md border border-slate-200">
        <div className="text-center mb-8 border-b border-slate-100 pb-6">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-full border border-blue-200 mb-3">
            Jinnah Postgraduate Medical Centre (JPMC) • Rafiqui Shaheed Road, Karachi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            INFORMED CONSENT FORM
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Assessing Cancer Caregiver burden in Karachi’s Public Healthcare System.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-8 mb-10">
          <section className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Information
            </h3>
            <ul className="list-none pl-0 space-y-2 m-0 text-sm">
              <li><strong className="text-slate-900">Principal Investigator:</strong> Dr. Anita Vallacha</li>
              <li><strong className="text-slate-900">Organization:</strong> Oncology Department, Jinnah Postgraduate Medical Centre (JPMC), Karachi</li>
              <li><strong className="text-slate-900">Phone:</strong> 0336-8025062</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">1. PURPOSE OF THIS RESEARCH STUDY</h3>
            <p className="leading-relaxed">You are being asked to participate in a research study designed to understand the experiences and challenges faced by family members who care for cancer patients. Many family caregivers in Pakistan experience significant stress, financial difficulties, and emotional strain while caring for their loved ones with cancer. This study aims to measure how burdened caregivers feel and to identify factors that may contribute to higher burden. The information gathered will help healthcare providers develop better support services for caregivers in the future.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">2. PROCEDURES</h3>
            <p className="mb-2">If you agree to participate in this study, you will be asked to do the following:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
              <li>Participate in a face-to-face interview that will take approximately 20–30 minutes.</li>
              <li>Answer questions about your experiences as a caregiver using a standard questionnaire called the Zarit Burden Interview (ZBI-22).</li>
              <li>Provide some basic information about yourself (such as age, gender, education, employment, income) and about the patient you care for.</li>
            </ul>
          </section>

          <div className="bg-blue-50 text-blue-900 p-5 rounded-lg border border-blue-100 text-sm shadow-xs">
            <p className="font-semibold mb-2 flex items-center gap-2 text-base">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Confidentiality Assured
            </p>
            <p className="leading-relaxed text-blue-800">Your identity in this study will be treated as strictly confidential. Your name will not be recorded on any data collection forms. Instead, you will be automatically assigned a unique participant code number.</p>
          </div>

          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">AUTHORIZATION</h3>
            <p className="leading-relaxed">I have read and understand this consent form, and I volunteer to participate in this research study. I voluntarily choose to participate, but I understand that my consent does not take away any legal rights in the case of negligence or other legal fault of anyone who is involved in this study.</p>
          </section>
        </div>

        <hr className="border-slate-200 mb-8" />

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-50 p-6 sm:p-8 rounded-xl border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="participantName" className="block text-sm font-semibold text-slate-700 mb-2">
                Name of Participant <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="participantName"
                required
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs bg-white"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-slate-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs bg-white"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              Signature of Participant <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs"
                  placeholder="Type your full name to sign"
                />
                
                <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Select Font:</span>
                  <select
                    value={signatureFont}
                    onChange={(e) => setSignatureFont(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1 shadow-xs bg-white"
                  >
                    <option value="'Caveat', cursive">Caveat</option>
                    <option value="'Dancing Script', cursive">Dancing Script</option>
                    <option value="'Pacifico', cursive">Pacifico</option>
                  </select>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg p-4 h-[124px] flex items-center justify-center overflow-hidden">
                {signatureText ? (
                  <span style={{ fontFamily: signatureFont, fontSize: '36px', color: '#1e293b' }}>
                    {signatureText}
                  </span>
                ) : (
                  <span className="text-slate-400 italic text-sm">Signature Preview will appear here</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 leading-relaxed font-medium">
                By submitting or signing this form, I agree to the terms of the informed consent and confirm that my information is accurate.
              </span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-70 shadow-md flex items-center justify-center gap-2 text-lg"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Consent...
                </>
              ) : (
                'I Consent & Continue to Survey'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
