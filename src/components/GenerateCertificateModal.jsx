import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Award, Loader2, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateCertificate, getCollegeById } from '../services/admin/adminServices';
import { getMyCollege } from '../services/collegeServices';
import { useMain } from '../context/MainContext';

const GenerateCertificateModal = ({
  isOpen,
  onClose,
  candidate,
  defaultDomain = "Event Participation",
  organizerName = "",
  eventId = null,
  eventType = "",
}) => {
  const { user } = useMain();
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    companyName: '',
    issuedDate: new Date().toISOString().split('T')[0],
    recipientEmail: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCert, setGeneratedCert] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [isCheckingSettings, setIsCheckingSettings] = useState(false);

  useEffect(() => {
    if (candidate && isOpen) {
      setFormData({
        name: candidate.fullName || candidate.name || '',
        domain: defaultDomain || candidate.domain || 'Event Participation',
        companyName: organizerName || candidate.organizer || candidate.collegeName || candidate.college || '',
        issuedDate: new Date().toISOString().split('T')[0],
        recipientEmail: candidate.mailId || candidate.email || candidate.mail || '',
      });
      setGeneratedCert(null);
    }
  }, [candidate, isOpen, defaultDomain, organizerName]);

  useEffect(() => {
    const checkCollegeSettings = async () => {
      if (!isOpen || !candidate) return;
      setIsCheckingSettings(true);
      try {
        let collegeData = null;
        if (user?.role === "college") {
          const res = await getMyCollege();
          collegeData = res?.data?.college || res?.data || null;
        } else if (candidate?.collegeId || candidate?.college?._id || (typeof candidate?.college === "string" && candidate.college.length === 24)) {
          const collegeId = candidate?.collegeId || candidate?.college?._id || candidate.college;
          const res = await getCollegeById(collegeId);
          collegeData = res?.data?.college || res?.data || null;
        }

        if (collegeData) {
          const missing = [];
          if (!collegeData.signatoryName?.trim()) missing.push("Authorized Signatory Name");
          if (!collegeData.signatoryDesignation?.trim()) missing.push("Signatory Designation");
          if (!collegeData.signatureUrl?.trim()) missing.push("Signature");
          if (!collegeData.certificateContentBody?.trim()) missing.push("Certificate Body");
          setMissingFields(missing);
        } else {
          setMissingFields([]);
        }
      } catch (err) {
        console.warn("College certificate settings check:", err);
      } finally {
        setIsCheckingSettings(false);
      }
    };

    checkCollegeSettings();
  }, [isOpen, candidate, user?.role]);

  if (!isOpen || !candidate) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.domain.trim() || !formData.issuedDate) {
      toast.error('Please fill in all required fields (Name, Domain/Event, and Issue Date)');
      return;
    }

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the required certificate field(s): ${missingFields.join(", ")} in College Certificate Profile and try again.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const candidateUserId = candidate.userId?._id || candidate.userId || candidate.id || null;

      const resData = await generateCertificate({
        userId: candidateUserId,
        eventId: eventId || candidate.eventId || candidate.event_id || null,
        eventType: eventType || candidate.eventType || null,
        name: formData.name.trim(),
        domain: formData.domain.trim(),
        companyName: formData.companyName.trim(),
        issuedDate: formData.issuedDate,
        recipientEmail: formData.recipientEmail.trim(),
      });

      toast.success('Certificate generated successfully!');
      setGeneratedCert(resData.data);
    } catch (err) {
      console.error("Certificate Generation Error:", err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to generate certificate';
      if (err.response?.data?.missingFields && Array.isArray(err.response.data.missingFields)) {
        setMissingFields(err.response.data.missingFields);
      }
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const getFullFileUrl = (urlPath) => {
    if (!urlPath) return '#';
    if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) return urlPath;
    const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
    return `${BASE_URL}${cleanPath}`;
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#171717] to-[#171717] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} /> Certificate Generator
            </span>
          </div>
          <h2 className="text-xl font-bold">Issue Certificate</h2>
          <p className="text-white/80 text-sm mt-1">Generate official PDF certificate for student</p>
        </div>

        {/* Content */}
        <div className="p-6 bg-white flex-1">
          {generatedCert ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={36} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Certificate Generated!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Issued to <span className="font-semibold text-gray-800">{generatedCert.name}</span> for {generatedCert.domain}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left text-xs space-y-1.5">
                <p><span className="font-semibold text-gray-600">Certificate ID:</span> {generatedCert.certificateId}</p>
                <p><span className="font-semibold text-gray-600">Issued Date:</span> {new Date(generatedCert.issuedDate).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Done
                </button>
                <a
                  href={getFullFileUrl(generatedCert.fileUrl || generatedCert.filePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-gradient-to-r from-[#171717] to-[#171717] text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition text-sm"
                >
                  <Download size={16} /> Download PDF
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {missingFields.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
                    <span>Incomplete College Certificate Settings</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    The college has not filled in the following required certificate field(s):
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {missingFields.map((field) => (
                      <span
                        key={field}
                        className="bg-amber-100/90 border border-amber-300 text-amber-950 px-2.5 py-1 rounded-lg font-semibold text-xs inline-flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        {field}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-700 font-medium pt-1">
                    Please complete the above field(s) in College Settings and try again.
                  </p>
                </div>
              )}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#171717] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Event / Domain Name *</label>
                <input
                  type="text"
                  required
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#171717] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">College / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#171717] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.issuedDate}
                    onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#171717] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#171717] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-[#171717] to-[#171717] text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Award size={16} /> Issue Certificate
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GenerateCertificateModal;
