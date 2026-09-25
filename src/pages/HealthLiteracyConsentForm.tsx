import React, { useState } from 'react';
import { Link } from 'react-router';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function HealthLiteracyConsentForm() {
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

      // Auto-generate Participant Code for Study 2 (e.g., HL-001)
      const collRef = collection(db, 'consents');
      const hlQuery = query(collRef, where('studyId', '==', 'health-literacy'));
      const snapshot = await getDocs(hlQuery);
      const nextIdNumber = snapshot.size + 1;
      const autoParticipantCode = `HL-${String(nextIdNumber).padStart(3, '0')}`;
      
      // Save to Firebase
      await addDoc(collRef, {
        studyId: 'health-literacy',
        studyTitle: 'Health Literacy & Cancer Pathways',
        participantCode: autoParticipantCode,
        participantName,
        date,
        signature: signatureDataUrl,
        createdAt: serverTimestamp()
      });

      // Redirect to Google Form for Study 2 in a new tab
      const study2FormLink = "https://forms.gle/mZozK9o5uBjL77X18";
      window.open(study2FormLink, '_blank', 'noopener,noreferrer');
      
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-xs"
          >
            ← All Studies
          </Link>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white">
            Study 2
          </span>
          <span className="text-xs font-medium text-emerald-900 hidden sm:inline">
            Patient Health Literacy Study
          </span>
        </div>

        <Link
          to="/study/caregiver-burden"
          className="text-xs text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1"
        >
          Looking for Caregiver Study? Switch to Study 1 →
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md border border-slate-200">
        <div className="text-center mb-8 border-b border-slate-100 pb-6">
          <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 mb-3">
            Jinnah Postgraduate Medical Centre (JPMC) • Rafiqui Shaheed Road, Karachi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            INFORMED CONSENT FORM
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Health Literacy and Its Impact on Cancer Diagnosis and Treatment Pathways: A Cross-Sectional Study at Jinnah Postgraduate Medical Centre, Karachi
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-8 mb-10">
          {/* Project Information */}
          <section className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1.5">
                <p><strong className="text-slate-900">Principal Investigator:</strong> Dr. Anita Vallacha</p>
                <p><strong className="text-slate-900">Department:</strong> Oncology Department, JPMC, Karachi</p>
                <p><strong className="text-slate-900">Phone:</strong> 0336-8025062</p>
              </div>
              <div className="space-y-1.5">
                <p><strong className="text-slate-900">Other Investigators:</strong> Prof. Dr. Ghulam Haider</p>
                <p><strong className="text-slate-900">Department:</strong> Oncology Department, JPMC, Karachi</p>
                <p><strong className="text-slate-900">Phone:</strong> 0300-2307257</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 border-t border-slate-200 pt-3">
              IRB Ref No: [To be assigned by JPMC IRB] • Sponsor: None
            </p>
          </section>

          {/* 1. Purpose */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">1. PURPOSE OF THIS RESEARCH STUDY</h3>
            <p className="leading-relaxed">
              You are being asked to participate in a research study designed to understand how well cancer patients understand health information and how this affects their journey from diagnosis to treatment. In Pakistan, many patients are diagnosed with cancer at a late stage, which can make treatment more difficult. This may be related to a patient&apos;s ability to find, understand, and use health information to make decisions about their health, known as <strong>health literacy</strong>.
            </p>
            <p className="leading-relaxed mt-3">
              This study aims to assess the health literacy levels of cancer patients at JPMC and to understand how it relates to their knowledge of cancer symptoms, their ability to seek help, and their understanding of treatment side effects. The information gathered will help healthcare providers develop better educational materials and support for patients in the future.
            </p>
          </section>

          {/* 2. Procedures */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">2. PROCEDURES</h3>
            <p className="mb-2">If you agree to participate in this study, you will be asked to do the following:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-emerald-500">
              <li>Participate in a <strong>single face-to-face interview</strong> that will take approximately <strong>30–45 minutes</strong>.</li>
              <li>Answer questions about your health, your understanding of your cancer diagnosis and treatment, and your experiences before coming to the hospital (including standard questionnaires on general health literacy, cancer warning signs, help-seeking behaviour, and chemotherapy side effects).</li>
              <li>Provide some basic demographic information (such as age, gender, education, and income) and details about your diagnosis and treatment from your medical records.</li>
              <li>The interview will be conducted in a private room at the Oncology Department of JPMC.</li>
              <li>Participation is for a single session only with no follow-up visits required. All procedures are for research purposes only with no experimental procedures.</li>
            </ul>
          </section>

          {/* 3. Risks & Discomforts */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">3. POSSIBLE RISKS OR DISCOMFORT</h3>
            <p className="mb-2">This study involves minimal risk. Steps to minimize any discomfort include:</p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-emerald-500 text-sm">
              <li>Interviews are conducted in a private, comfortable setting to ensure complete privacy.</li>
              <li>You are free to skip any question you do not wish to answer.</li>
              <li>You may take a break at any time during the interview or withdraw without any effect on your medical care.</li>
              <li>If you experience emotional distress, you will be offered a referral to psychosocial support services within JPMC.</li>
            </ul>
          </section>

          {/* 4. Benefits & Financial Considerations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
              <h4 className="font-semibold text-slate-900 mb-2">4. Possible Benefits</h4>
              <p className="text-slate-600 leading-relaxed">
                While there may be no direct medical benefit to you personally, the knowledge gained will help develop better educational materials, community awareness, and earlier diagnosis pathways for future cancer patients in Pakistan.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
              <h4 className="font-semibold text-slate-900 mb-2">5. Financial Considerations</h4>
              <p className="text-slate-600 leading-relaxed">
                There is no payment and <strong>no additional cost</strong> to you for participating. You will not be charged for the interview or study-related procedures.
              </p>
            </div>
          </div>

          {/* Confidentiality Callout */}
          <div className="bg-emerald-50 text-emerald-950 p-5 rounded-lg border border-emerald-200 text-sm shadow-xs">
            <p className="font-semibold mb-2 flex items-center gap-2 text-base text-emerald-900">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Strict Confidentiality Assured
            </p>
            <p className="leading-relaxed text-emerald-900">
              Your identity will be treated as strictly confidential. Your name will never be recorded on public data collection forms or research publications; instead, you will be automatically assigned a unique participant code number (e.g. HL-001).
            </p>
          </div>

          {/* 12. Authorization */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">12. AUTHORIZATION</h3>
            <p className="leading-relaxed">
              I have read and understand this consent form, and I volunteer to participate in this research study. I understand that I will receive a copy of this form. I voluntarily choose to participate, but I understand that my consent does not take away any legal rights.
            </p>
          </section>
        </div>

        <hr className="border-slate-200 mb-8" />

        {/* Consent Form Input */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-50 p-6 sm:p-8 rounded-xl border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="participantName" className="block text-sm font-semibold text-slate-700 mb-2">
                Name of Participant (Printed or Typed) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="participantName"
                required
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-xs bg-white"
                placeholder="Enter patient full name"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-xs bg-white"
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-xs"
                  placeholder="Type your name to generate signature"
                />
                
                <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Select Font:</span>
                  <select
                    value={signatureFont}
                    onChange={(e) => setSignatureFont(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 flex-1 shadow-xs bg-white"
                  >
                    <option value="'Caveat', cursive">Caveat</option>
                    <option value="'Dancing Script', cursive">Dancing Script</option>
                    <option value="'Pacifico', cursive">Pacifico</option>
                  </select>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg p-4 h-[124px] flex items-center justify-center overflow-hidden">
                {signatureText ? (
                  <span style={{ fontFamily: signatureFont, fontSize: '36px', color: '#064e3b' }}>
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
                className="mt-0.5 w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700 leading-relaxed font-medium">
                By submitting or signing this form, I agree to the terms of the informed consent for Study 2 (Health Literacy) and confirm that my information is accurate.
              </span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 transition-all disabled:opacity-70 shadow-md flex items-center justify-center gap-2 text-lg"
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
