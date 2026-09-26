import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext.tsx';
import {
  adminGetOpportunities,
  adminCreateOpportunity,
  adminUpdateOpportunity,
  adminDeleteOpportunity,
  adminResetDatabase,
} from '../services/api.ts';
import { Opportunity, OpportunityCategory, EducationLevel } from '../types.ts';
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  X,
  LogOut,
} from 'lucide-react';

interface Props {
  adminToken: string;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<Props> = ({ adminToken, onLogout }) => {
  const { navigate } = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOpp, setEditingOpp] = useState<Partial<Opportunity> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAll = () => {
    setLoading(true);
    adminGetOpportunities(adminToken)
      .then((data) => {
        setOpportunities(data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Session expired. Please log in again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAll();
  }, [adminToken]);

  const handleTogglePublish = async (opp: Opportunity) => {
    try {
      await adminUpdateOpportunity(adminToken, opp.id, { isPublished: !opp.isPublished });
      setSuccessMsg(`Status updated for ${opp.shortName}`);
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await adminDeleteOpportunity(adminToken, id);
      setSuccessMsg('Opportunity deleted successfully.');
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Reset database to default verified opportunities? Any manual changes will be replaced.')) return;
    try {
      await adminResetDatabase(adminToken);
      setSuccessMsg('Database successfully reset to official default records.');
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleSaveOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp) return;
    setErrorMsg('');

    try {
      if (isNew) {
        await adminCreateOpportunity(adminToken, editingOpp);
        setSuccessMsg('New opportunity added successfully.');
      } else {
        await adminUpdateOpportunity(adminToken, editingOpp.id!, editingOpp);
        setSuccessMsg('Opportunity rules updated successfully.');
      }
      setEditingOpp(null);
      loadAll();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const startNewOpp = () => {
    setIsNew(true);
    setEditingOpp({
      name: '',
      shortName: '',
      slug: '',
      category: 'Defence',
      conductingOrg: '',
      summary: '',
      description: '',
      minEducationLevel: 'class12',
      allowedEducationLevels: ['class12', 'graduate'],
      ageRule: {
        minAge: 18,
        maxAge: 27,
        cutoffReferenceText: 'As on 1st August of examination year',
        allowFinalYearAppearing: true,
      },
      categoryAgeRelaxation: {
        OBC: 3,
        SC: 5,
        ST: 5,
        PwBD: 10,
        EWS: 0,
      },
      genderAllowed: 'all',
      maritalStatus: 'any',
      subjectRequirements: {
        mathsRequired: false,
        physicsRequired: false,
        chemistryRequired: false,
        biologyRequired: false,
        englishRequired: false,
        notes: '',
      },
      minPercentageClass12: 0,
      minPercentageGraduation: 0,
      citizenshipRequired: 'indian',
      domicileRequired: 'none',
      attemptsRule: {
        hasFixedAttemptLimit: false,
        cyclesPerYear: 1,
        officialRuleText: 'No attempt limit. Eligible as long as within the age limit.',
      },
      currentCycle: {
        cycleName: '2026 Recruitment Cycle',
        officialSourceUrl: 'https://upsc.gov.in',
        officialSourceOrg: 'Recruitment Commission',
        lastVerifiedDate: new Date().toISOString().slice(0, 10),
        isVerified: true,
      },
      selectionStages: ['Preliminary Written Exam', 'Main Examination / Interview'],
      requiredDocuments: ['Class 10 Certificate for DOB proof', 'Degree Certificate', 'Category Certificate if claiming relaxation'],
      faqs: [],
      isPublished: true,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-slate-900 text-white">
              Admin Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">Secure Rules Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Exam &amp; Eligibility Rules Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startNewOpp}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Opportunity</span>
          </button>

          <button
            onClick={handleResetDb}
            title="Reset default records"
            className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')}>
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')}>
            <X className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      )}

      {/* Opportunities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-800">
            Stored Opportunities ({opportunities.length})
          </span>
          <span className="text-xs text-slate-500">
            Changes are persisted to server storage immediately
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Exam / Opportunity Name</th>
                <th className="px-4 py-3 text-left font-bold">Category</th>
                <th className="px-4 py-3 text-left font-bold">Min Qualification</th>
                <th className="px-4 py-3 text-left font-bold">Age Criteria</th>
                <th className="px-4 py-3 text-left font-bold">Cycle / Verified</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs">
                    <div>{opp.name}</div>
                    <span className="text-[11px] text-slate-400 font-mono">/opportunities/{opp.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                      {opp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium capitalize">
                    {opp.minEducationLevel.replace('class', 'Class ')}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {opp.ageRule.dobMin ? (
                      <span className="font-mono text-[11px]">{opp.ageRule.dobMin.slice(0, 4)} - {opp.ageRule.dobMax?.slice(0, 4)}</span>
                    ) : (
                      `${opp.ageRule.minAge ?? '-'} to ${opp.ageRule.maxAge ?? '-'} yrs`
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <div className="font-medium text-slate-700">{opp.currentCycle.cycleName}</div>
                    <div className="text-[10px]">Verified: {opp.currentCycle.lastVerifiedDate}</div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(opp)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] cursor-pointer ${
                        opp.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {opp.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{opp.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/opportunities/${opp.slug}`)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setIsNew(false);
                          setEditingOpp(opp);
                        }}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit Rules"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(opp.id, opp.name)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Opportunity Modal */}
      {editingOpp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isNew ? 'Add New Opportunity' : `Edit Rules: ${editingOpp.name}`}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure eligibility parameters without touching application code.
                </p>
              </div>
              <button
                onClick={() => setEditingOpp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOpp} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Basic Metadata */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingOpp.name || ''}
                      onChange={(e) => setEditingOpp({ ...editingOpp, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      placeholder="e.g. National Defence Academy Examination"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Short Name *</label>
                    <input
                      type="text"
                      required
                      value={editingOpp.shortName || ''}
                      onChange={(e) => setEditingOpp({ ...editingOpp, shortName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      placeholder="e.g. NDA & NA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Slug (URL Path) *</label>
                    <input
                      type="text"
                      required
                      value={editingOpp.slug || ''}
                      onChange={(e) => setEditingOpp({ ...editingOpp, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                      placeholder="e.g. nda-eligibility"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Category *</label>
                    <select
                      value={editingOpp.category || 'Defence'}
                      onChange={(e) => setEditingOpp({ ...editingOpp, category: e.target.value as OpportunityCategory })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Defence">Defence</option>
                      <option value="UPSC">UPSC</option>
                      <option value="SSC">SSC</option>
                      <option value="Banking & Finance">Banking & Finance</option>
                      <option value="Railways">Railways</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Medical">Medical</option>
                      <option value="Law">Law</option>
                      <option value="Management">Management</option>
                      <option value="College & University Admissions">College Admissions</option>
                      <option value="Maritime">Maritime</option>
                      <option value="State Exams">State Exams</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Conducting Body *</label>
                    <input
                      type="text"
                      required
                      value={editingOpp.conductingOrg || ''}
                      onChange={(e) => setEditingOpp({ ...editingOpp, conductingOrg: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      placeholder="e.g. UPSC"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Summary *</label>
                  <input
                    type="text"
                    required
                    value={editingOpp.summary || ''}
                    onChange={(e) => setEditingOpp({ ...editingOpp, summary: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="Brief 1-line overview"
                  />
                </div>
              </div>

              {/* Age Rules & DOB Boundaries */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Age &amp; Date of Birth Rules
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Min Age (Years)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editingOpp.ageRule?.minAge ?? ''}
                      onChange={(e) =>
                        setEditingOpp({
                          ...editingOpp,
                          ageRule: { ...editingOpp.ageRule!, minAge: e.target.value ? Number(e.target.value) : undefined },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Max Age (Years)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editingOpp.ageRule?.maxAge ?? ''}
                      onChange={(e) =>
                        setEditingOpp({
                          ...editingOpp,
                          ageRule: { ...editingOpp.ageRule!, maxAge: e.target.value ? Number(e.target.value) : undefined },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">DOB Min (Earliest)</label>
                    <input
                      type="date"
                      value={editingOpp.ageRule?.dobMin ?? ''}
                      onChange={(e) =>
                        setEditingOpp({
                          ...editingOpp,
                          ageRule: { ...editingOpp.ageRule!, dobMin: e.target.value || undefined },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">DOB Max (Latest)</label>
                    <input
                      type="date"
                      value={editingOpp.ageRule?.dobMax ?? ''}
                      onChange={(e) =>
                        setEditingOpp({
                          ...editingOpp,
                          ageRule: { ...editingOpp.ageRule!, dobMax: e.target.value || undefined },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Category Relaxations */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Category Upper Age Relaxations (+Years)
                  </span>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">OBC Relaxation</label>
                      <input
                        type="number"
                        value={editingOpp.categoryAgeRelaxation?.OBC ?? 0}
                        onChange={(e) =>
                          setEditingOpp({
                            ...editingOpp,
                            categoryAgeRelaxation: {
                              ...editingOpp.categoryAgeRelaxation,
                              OBC: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">SC Relaxation</label>
                      <input
                        type="number"
                        value={editingOpp.categoryAgeRelaxation?.SC ?? 0}
                        onChange={(e) =>
                          setEditingOpp({
                            ...editingOpp,
                            categoryAgeRelaxation: {
                              ...editingOpp.categoryAgeRelaxation,
                              SC: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">ST Relaxation</label>
                      <input
                        type="number"
                        value={editingOpp.categoryAgeRelaxation?.ST ?? 0}
                        onChange={(e) =>
                          setEditingOpp({
                            ...editingOpp,
                            categoryAgeRelaxation: {
                              ...editingOpp.categoryAgeRelaxation,
                              ST: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">PwBD Relaxation</label>
                      <input
                        type="number"
                        value={editingOpp.categoryAgeRelaxation?.PwBD ?? 0}
                        onChange={(e) =>
                          setEditingOpp({
                            ...editingOpp,
                            categoryAgeRelaxation: {
                              ...editingOpp.categoryAgeRelaxation,
                              PwBD: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Subjects */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Education &amp; Subject Conditions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Min Education Level</label>
                    <select
                      value={editingOpp.minEducationLevel || 'class12'}
                      onChange={(e) =>
                        setEditingOpp({
                          ...editingOpp,
                          minEducationLevel: e.target.value as EducationLevel,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="class10">Class 10</option>
                      <option value="class12">Class 12</option>
                      <option value="diploma">Diploma</option>
                      <option value="graduate">Graduate (Degree)</option>
                      <option value="postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Min 12th Marks (%)</label>
                    <input
                      type="number"
                      value={editingOpp.minPercentageClass12 ?? 0}
                      onChange={(e) =>
                        setEditingOpp({ ...editingOpp, minPercentageClass12: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      placeholder="0 for none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Min Graduation Marks (%)</label>
                    <input
                      type="number"
                      value={editingOpp.minPercentageGraduation ?? 0}
                      onChange={(e) =>
                        setEditingOpp({ ...editingOpp, minPercentageGraduation: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      placeholder="0 for none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 block">Mandatory Subjects (Class 12)</span>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={editingOpp.subjectRequirements?.mathsRequired || false}
                        onChange={(e) =>
                          setEditingOpp({
                            ...editingOpp,
                            subjectRequirements: {
                              ...editingOpp.subjectRequirements,
                              mathsRequired: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Mathematics</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={editingOpp.subjectRequirements?.physicsRequired || false}
                        onChange={(e) =>
                          setEditingOpp({
                            ...editingOpp,
                            subjectRequirements: {
                              ...editingOpp.subjectRequirements,
                              physicsRequired: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Physics</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={editingOpp.subjectRequirements?.chemistryRequired || false}
                        onChange={(e) =>
                          setEditingOpp({
                            ...editingOpp,
                            subjectRequirements: {
                              ...editingOpp.subjectRequirements,
                              chemistryRequired: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Chemistry</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={editingOpp.subjectRequirements?.biologyRequired || false}
                        onChange={(e) =>
                          setEditingOpp({
                            ...editingOpp,
                            subjectRequirements: {
                              ...editingOpp.subjectRequirements,
                              biologyRequired: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Biology</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Official Source & Verification */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Official Verification Source
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Official Portal URL *</label>
                    <input
                      type="url"
                      required
                      value={editingOpp.currentCycle?.officialSourceUrl || ''}
                      onChange={(e) =>
                        setEditingOpp({
                          ...editingOpp,
                          currentCycle: {
                            ...editingOpp.currentCycle!,
                            officialSourceUrl: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Source Body Name *</label>
                    <input
                      type="text"
                      required
                      value={editingOpp.currentCycle?.officialSourceOrg || ''}
                      onChange={(e) =>
                        setEditingOpp({
                          ...editingOpp,
                          currentCycle: {
                            ...editingOpp.currentCycle!,
                            officialSourceOrg: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Last Verified Date</label>
                    <input
                      type="date"
                      value={editingOpp.currentCycle?.lastVerifiedDate || ''}
                      onChange={(e) =>
                        setEditingOpp({
                          ...editingOpp,
                          currentCycle: {
                            ...editingOpp.currentCycle!,
                            lastVerifiedDate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOpp(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
