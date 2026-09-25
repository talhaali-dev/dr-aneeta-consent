import React from 'react';
import { Link } from 'react-router';
import { STUDIES } from '../data/studies';

export function StudySelector() {
  const caregiverStudy = STUDIES['caregiver-burden'];
  const healthLiteracyStudy = STUDIES['health-literacy'];

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          JPMC Oncology Research Department
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Informed Consent Portal
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
          Please select the research study you are participating in to review its informed consent agreement and proceed with registration.
        </p>
      </div>

      {/* Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Study 1 Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                {caregiverStudy.badge} • Caregivers
              </span>
              <span className="text-xs text-slate-500 font-medium">ID: caregiver-burden</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
              {caregiverStudy.title}
            </h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {caregiverStudy.subtitle}
            </p>

            <div className="space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <span className="font-semibold text-slate-900">Participants:</span> {caregiverStudy.targetGroup}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-semibold text-slate-900">Duration:</span> {caregiverStudy.duration}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <span className="font-semibold text-slate-900">Lead Investigator:</span> {caregiverStudy.principalInvestigator} (JPMC Oncology)
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <Link
              to={caregiverStudy.path}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all focus:ring-4 focus:ring-blue-500/20"
            >
              <span>Open Study 1 Consent Form</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Study 2 Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {healthLiteracyStudy.badge} • Patients
              </span>
              <span className="text-xs text-slate-500 font-medium">ID: health-literacy</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
              {healthLiteracyStudy.title}
            </h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {healthLiteracyStudy.subtitle}
            </p>

            <div className="space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <span className="font-semibold text-slate-900">Participants:</span> {healthLiteracyStudy.targetGroup}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-semibold text-slate-900">Duration:</span> {healthLiteracyStudy.duration}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <span className="font-semibold text-slate-900">Lead Investigators:</span> {healthLiteracyStudy.principalInvestigator} & Prof. Dr. Ghulam Haider
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <Link
              to={healthLiteracyStudy.path}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all focus:ring-4 focus:ring-emerald-500/20"
            >
              <span>Open Study 2 Consent Form</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Quick Link */}
      <div className="bg-slate-100/80 rounded-xl p-5 border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-800">Are you a study administrator?</p>
          <p className="text-xs text-slate-500">Access the admin panel to view records and download stamped consent PDFs.</p>
        </div>
        <Link
          to="/admin"
          className="text-xs font-semibold px-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
        >
          Go to Admin Dashboard →
        </Link>
      </div>
    </div>
  );
}
