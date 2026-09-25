import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PDFDocument, rgb } from 'pdf-lib';
import { STUDIES } from '../data/studies';

interface ConsentRecord {
  id: string;
  studyId?: string;
  studyTitle?: string;
  participantCode: string;
  participantName: string;
  date: string;
  signature: string;
  createdAt: any;
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [selectedStudyTab, setSelectedStudyTab] = useState<'caregiver-burden' | 'health-literacy'>('caregiver-burden');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchConsents = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'consents'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data: ConsentRecord[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ConsentRecord);
      });
      setConsents(data);
    } catch (error) {
      console.error("Error fetching consents: ", error);
      alert('Error fetching records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConsents();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple placeholder password
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const isCaregiverRecord = (record: ConsentRecord) => {
    return !record.studyId || record.studyId === 'caregiver-burden';
  };

  const isHealthLiteracyRecord = (record: ConsentRecord) => {
    return record.studyId === 'health-literacy';
  };

  const caregiverCount = consents.filter(isCaregiverRecord).length;
  const healthLiteracyCount = consents.filter(isHealthLiteracyRecord).length;

  const currentStudyConsents = consents.filter((record) => {
    if (selectedStudyTab === 'caregiver-burden') {
      return isCaregiverRecord(record);
    } else {
      return isHealthLiteracyRecord(record);
    }
  });

  const filteredConsents = currentStudyConsents.filter(record => 
    record.participantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.participantCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePDF = async (record: ConsentRecord) => {
    try {
      setIsGenerating(record.id);
      const isHealthLit = isHealthLiteracyRecord(record);
      
      const pdfPath = isHealthLit 
        ? '/JPMC-ICF-Health-Literacy.pdf' 
        : '/ICF-Caregivers.pdf';

      const response = await fetch(pdfPath);
      if (!response.ok) throw new Error(`Could not fetch template PDF from ${pdfPath}`);
      const templateBuffer = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(templateBuffer);
      const pages = pdfDoc.getPages();
      
      // Both templates have signature and authorization on Page 6 (index 5)
      const page = pages[5];

      if (isHealthLit) {
        // --- Health Literacy Coordinates ---
        // Participant name (starts after "Name of participant (Printed or Typed): " at x=72)
        page.drawRectangle({
          x: 280, y: 232, width: 230, height: 18,
          color: rgb(1, 1, 1)
        });
        page.drawText(record.participantName || '', {
          x: 283, y: 235, size: 11, color: rgb(0, 0, 0)
        });

        // Date line 1 (starts after "Date: " at x=72)
        page.drawRectangle({
          x: 104, y: 209, width: 140, height: 18,
          color: rgb(1, 1, 1)
        });
        page.drawText(record.date || '', {
          x: 108, y: 212, size: 11, color: rgb(0, 0, 0)
        });

        // Signature field (starts after "Signature of participant: " at x=72)
        page.drawRectangle({
          x: 202, y: 186, width: 220, height: 20,
          color: rgb(1, 1, 1)
        });

        // Date line 2
        page.drawRectangle({
          x: 104, y: 163, width: 140, height: 18,
          color: rgb(1, 1, 1)
        });
        page.drawText(record.date || '', {
          x: 108, y: 166, size: 11, color: rgb(0, 0, 0)
        });

        // Embed signature PNG
        if (record.signature) {
          const signatureBuffer = await fetch(record.signature).then(res => res.arrayBuffer());
          const pngImage = await pdfDoc.embedPng(signatureBuffer);
          const dims = pngImage.scaleToFit(140, 32);
          page.drawImage(pngImage, {
            x: 205,
            y: 204 - dims.height,
            width: dims.width,
            height: dims.height
          });
        }
      } else {
        // --- Caregiver Burden Coordinates ---
        // Draw white rectangle over {{ParticipantName}} to hide the placeholder
        page.drawRectangle({
          x: 332, y: 232, width: 200, height: 16,
          color: rgb(1, 1, 1)
        });
        page.drawText(record.participantName || '', {
          x: 333, y: 234, size: 12, color: rgb(0, 0, 0)
        });

        // Draw white rectangle over {{Date}}
        page.drawRectangle({
          x: 332, y: 194, width: 100, height: 16,
          color: rgb(1, 1, 1)
        });
        page.drawText(record.date || '', {
          x: 333, y: 196, size: 12, color: rgb(0, 0, 0)
        });

        // Draw white rectangle over {{SignatureField}}
        page.drawRectangle({
          x: 332, y: 155, width: 150, height: 16,
          color: rgb(1, 1, 1)
        });
        
        // Embed the generated PNG signature
        if (record.signature) {
          const signatureBuffer = await fetch(record.signature).then(res => res.arrayBuffer());
          const pngImage = await pdfDoc.embedPng(signatureBuffer);
          const dims = pngImage.scaleToFit(140, 32);
          page.drawImage(pngImage, {
            x: 333,
            y: 171 - dims.height,
            width: dims.width,
            height: dims.height
          });
        }
      }

      // Serialize and download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const cleanName = (record.participantName || 'Participant').replace(/\s+/g, '_');
      const link = document.createElement('a');
      link.href = url;
      link.download = `Consent_${record.participantCode}_${cleanName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert('Error generating PDF. Please check the console.');
    } finally {
      setIsGenerating(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'consents', deleteConfirmId));
      setConsents(consents.filter(record => record.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert('Failed to delete the record.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
          <p className="text-sm text-slate-500 mt-2">Enter your passcode to view consent records.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
              placeholder="Enter admin passcode"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-md">
            Secure Login
          </button>
        </form>
      </div>
    );
  }

  const activeStudyConfig = STUDIES[selectedStudyTab];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200 mt-4 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-1">
            JPMC Oncology Administration
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Signed Consents</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage and download participant consent records across studies.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('adminAuth');
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Study Selection Tabs */}
      <div className="mt-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 border-b border-slate-200 pb-px">
          {/* Tab 1: Cancer Caregiver Burden */}
          <button
            type="button"
            onClick={() => {
              setSelectedStudyTab('caregiver-burden');
              setSearchQuery('');
            }}
            className={`flex items-center gap-3 px-5 py-3.5 border-b-2 font-medium text-sm transition-all cursor-pointer text-left ${
              selectedStudyTab === 'caregiver-burden'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${selectedStudyTab === 'caregiver-burden' ? 'bg-blue-600' : 'bg-slate-300'}`} />
              <span className="font-semibold">{STUDIES['caregiver-burden'].title}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              selectedStudyTab === 'caregiver-burden' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {caregiverCount}
            </span>
          </button>

          {/* Tab 2: Health Literacy & Cancer Pathways */}
          <button
            type="button"
            onClick={() => {
              setSelectedStudyTab('health-literacy');
              setSearchQuery('');
            }}
            className={`flex items-center gap-3 px-5 py-3.5 border-b-2 font-medium text-sm transition-all cursor-pointer text-left ${
              selectedStudyTab === 'health-literacy'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${selectedStudyTab === 'health-literacy' ? 'bg-emerald-600' : 'bg-slate-300'}`} />
              <span className="font-semibold">{STUDIES['health-literacy'].title}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              selectedStudyTab === 'health-literacy' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {healthLiteracyCount}
            </span>
          </button>
        </div>
      </div>

      {/* Active Study Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
              selectedStudyTab === 'caregiver-burden' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {activeStudyConfig.badge}
            </span>
            <h3 className="font-bold text-slate-800 text-base">
              {activeStudyConfig.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredConsents.length} {filteredConsents.length === 1 ? 'record' : 'records'} for this study
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs bg-white"
          />
        </div>
      </div>
      
      {/* Records Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-xs">
        <table className="w-full text-left border-collapse bg-white">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-sm font-semibold text-slate-600">Patient ID</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Participant Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date Signed</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td className="p-8 text-sm text-slate-500" colSpan={4} align="center">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading records...
                  </div>
                </td>
              </tr>
            ) : filteredConsents.length === 0 ? (
              <tr>
                <td className="p-8 text-sm text-slate-500" colSpan={4} align="center">
                  {searchQuery 
                    ? 'No records match your search in this study.' 
                    : `No consent records found for ${activeStudyConfig.title}.`}
                </td>
              </tr>
            ) : (
              filteredConsents.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-sm text-slate-900 font-semibold">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      selectedStudyTab === 'caregiver-burden' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {record.participantCode}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-700 font-medium">{record.participantName}</td>
                  <td className="p-4 text-sm text-slate-500">{record.date}</td>
                  <td className="p-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => generatePDF(record)}
                        disabled={isGenerating === record.id}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50"
                      >
                        {isGenerating === record.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(record.id)}
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 font-medium transition-colors"
                        title="Delete record"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Record</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this consent record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Record'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
