import React, { useState } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { addCustomer as addCustomerApi } from '../../api/api';
import { useAuth } from '../../hooks/useAuth';

const defaultForm = {
  customerName: '',
  hasLoan: 'no',
  hasDeposit: 'no',
  hasDefault: 'no',
  category: 'Non Priority',
  balance: 0,
  notes: [],
  age: '',
  job: '',
  marital: 'single',
  education: '',
  default: 'no',
  housing: 'no',
  loan: 'no',
  contact: 'cellular',
  month: '',
  day: '',
  duration: '',
  campaign: '',
  pdays: '',
  previous: '',
  poutcome: '',
  emp_var_rate: '',
  cons_price_idx: '',
  cons_conf_idx: '',
  euribor3m: '',
  nr_employed: '',
  y: 'no'
};

const CustomerEntryContainer = () => {
  const { setCustomers } = useCustomers();
  const { token } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);

  const FIELD_INFO_EN = {
    customerName: 'Customer full name.',
    age: 'Customer age (numeric).',
    job: 'Customer job title or category (e.g., "admin.", "blue-collar", "management").',
    marital: 'Customer marital status ("married", "single", "divorced").',
    education: 'Customer education level ("primary", "secondary", "tertiary").',
    default: 'Whether the customer has delinquent credit ("yes", "no").',
    balance: 'Annual average balance (EUR).',
    housing: 'Whether the customer has a housing loan ("yes", "no").',
    loan: 'Whether the customer has a personal loan ("yes", "no").',
    contact: 'Last contact communication type ("cellular", "telephone").',
    day: 'Last contact day of month (1-31).',
    month: 'Last contact month ("jan", "feb", etc.).',
    duration: 'Last contact duration in seconds (numeric).',
    campaign: 'Number of contacts during this campaign for the customer (numeric).',
    pdays: 'Days since last contact from previous campaign (-1 = never contacted).',
    previous: 'Number of contacts before this campaign (numeric).',
    poutcome: 'Result of previous marketing campaign ("success", "failure", "other").',
    cons_price_idx: 'Consumer Price Index (monthly, numeric).',
    cons_conf_idx: 'Consumer Confidence Index (monthly, numeric).',
    euribor3m: 'Euribor 3-month rate (numeric).',
    nr_employed: 'Number of employees (quarterly, numeric).',
    emp_var_rate: 'Employment variation rate (numeric).',
    category: 'Customer category (Priority / Non Priority).',
    hasLoan: 'Whether the customer has a personal loan (yes/no).',
    hasDeposit: 'Whether the customer has a deposit (yes/no).',
    notes: 'Promotion notes — multiple lines allowed.'
  };

  const handleChange = (k) => (e) => {
    const val = e?.target?.value ?? e;
    setForm((p) => ({ ...p, [k]: val }));
  };

  const validate = () => {
    const requiredFields = [
      'customerName','age','job','marital','education','default','balance','housing','loan','contact',
      'month','day','duration','campaign','pdays','previous','poutcome','emp_var_rate','cons_price_idx','cons_conf_idx','euribor3m','nr_employed','category','hasLoan','hasDeposit','notes'
    ];

    const nextErrors = {};
    requiredFields.forEach((k) => {
      const val = form[k];
      // treat empty string/null/undefined as missing. pdays may be -1 allowed but still required
      if (val === '' || val === null || typeof val === 'undefined') {
        nextErrors[k] = 'Field ini wajib diisi';
      } else if (k === 'age' && Number(val) <= 0) {
        nextErrors[k] = 'Masukkan usia yang valid (> 0)';
      } else if (k === 'day') {
        const d = Number(val);
        if (!d || d < 1 || d > 31) nextErrors[k] = 'Masukkan hari (1 - 31)';
      } else if ((k === 'cons_price_idx' || k === 'cons_conf_idx' || k === 'euribor3m' || k === 'nr_employed' || k === 'emp_var_rate') && isNaN(Number(val))) {
        nextErrors[k] = 'Masukkan nilai numerik yang valid';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // validation: ensure all required fields have values
      setMessage('');
      setErrors({});
      const ok = validate();
      if (!ok) {
        setMessage('Beberapa field wajib belum diisi. Silakan lengkapi sebelum menyimpan.');
        setSaving(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const tempId = Date.now();
      const payload = { ...form };

      payload.balance = Number(payload.balance) || 0;
      payload.age = Number(payload.age) || null;
      payload.duration = Number(payload.duration) || 0;
      payload.campaign = Number(payload.campaign) || 0;
      payload.pdays = Number(payload.pdays) || 999;
      payload.previous = Number(payload.previous) || 0;
      payload.emp_var_rate = Number(payload.emp_var_rate) || null;
      payload.cons_price_idx = Number(payload.cons_price_idx) || null;
      payload.cons_conf_idx = Number(payload.cons_conf_idx) || null;
      payload.euribor3m = Number(payload.euribor3m) || null;
      payload.nr_employed = Number(payload.nr_employed) || null;

      const localCopy = { id: tempId, customerId: `T-${tempId}`, ...payload };
      setCustomers((prev) => [localCopy, ...(prev || [])]);

      // call backend if token available
      if (token) {
        try {
          const res = await addCustomerApi(token, payload);
          if (res?.error) setMessage('Saved locally but server rejected the request.');
          else setMessage('Saved successfully.');
        } catch (err) {
          // Log the error so it's not an unused variable — keeps eslint happy and aids debugging.
          console.error(err);
          setMessage('Saved locally; failed to send to server.');
        }
      } else {
        setMessage('Saved locally (no auth token).');
      }

      setForm(defaultForm);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-6 pr-2 min-w-0">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-3">
              <span>Customer Entry</span>
              <button
                type="button"
                onClick={() => setShowInfoModal(true)}
                aria-label="Field information"
                title="Field information"
                className="w-6 h-6 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center text-white text-sm font-semibold transition-colors shadow-sm"
              >
                i
              </button>
            </h2>
            <p className="text-sm text-gray-500 mb-6">Enter new customer data</p>
          </div>
        </div>

        {showInfoModal && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-[min(900px,95%)] max-h-[90vh] overflow-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Customer Entry - Field Descriptions</h3>
                <button type="button" onClick={() => setShowInfoModal(false)} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                {Object.entries(FIELD_INFO_EN).map(([key, text]) => (
                  <div key={key} className="p-3 border rounded bg-gray-50">
                    <div className="font-semibold text-sm mb-1">{key}</div>
                    <div className="text-xs text-gray-600">{text}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-right">
                <button type="button" onClick={() => setShowInfoModal(false)} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Got it</button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Customer Name <span className="text-red-500">*</span></span>
            </label>
            <input value={form.customerName} onChange={handleChange('customerName')} className={`w-full border rounded px-3 py-2 ${errors.customerName ? 'border-red-500' : ''}`} />
            {errors.customerName && <div className="text-sm text-red-700 mt-1">{errors.customerName}</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Category <span className="text-red-500">*</span></span>
            </label>
            <select value={form.category} onChange={handleChange('category')} className="w-full border rounded px-3 py-2">
              <option>Priority</option>
              <option>Non Priority</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Age <span className="text-red-500">*</span></span>
            </label>
            <input type="number" value={form.age} onChange={handleChange('age')} className={`w-full border rounded px-3 py-2 ${errors.age ? 'border-red-500' : ''}`} />
            {errors.age && <div className="text-sm text-red-700 mt-1">{errors.age}</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Job <span className="text-red-500">*</span></span>
            </label>
            <input value={form.job} onChange={handleChange('job')} className={`w-full border rounded px-3 py-2 ${errors.job ? 'border-red-500' : ''}`} />
            {errors.job && <div className="text-sm text-red-700 mt-1">{errors.job}</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Marital Status <span className="text-red-500">*</span></span>
            </label>
            <select value={form.marital} onChange={handleChange('marital')} className="w-full border rounded px-3 py-2">
              <option value="single">single</option>
              <option value="married">married</option>
              <option value="divorced">divorced</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Education <span className="text-red-500">*</span></span>
            </label>
            <select value={form.education} onChange={handleChange('education')} className="w-full border rounded px-3 py-2">
              <option value="">Select education level</option>
              <option value="primary">primary</option>
              <option value="secondary">secondary</option>
              <option value="tertiary">tertiary</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Personal Loan <span className="text-red-500">*</span></span>
            </label>
            <select value={form.hasLoan} onChange={handleChange('hasLoan')} className="w-full border rounded px-3 py-2">
              <option value="no">no</option>
              <option value="yes">yes</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Housing Deposit <span className="text-red-500">*</span></span>
            </label>
            <select value={form.hasDeposit} onChange={handleChange('hasDeposit')} className="w-full border rounded px-3 py-2">
              <option value="no">no</option>
              <option value="yes">yes</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Balance (annual average, EUR) <span className="text-red-500">*</span></span>
            </label>
            <input type="number" step="0.01" value={form.balance} onChange={handleChange('balance')} className={`w-full border rounded px-3 py-2 ${errors.balance ? 'border-red-500' : ''}`} />
            {errors.balance && <div className="text-sm text-red-700 mt-1">{errors.balance}</div>}

          </div>

          <div className="space-y-3">

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Housing Loan <span className="text-red-500">*</span></span>
            </label>
            <select value={form.housing} onChange={handleChange('housing')} className="w-full border rounded px-3 py-2">
              <option value="no">no</option>
              <option value="yes">yes</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Default (delinquent payment) <span className="text-red-500">*</span></span>
            </label>
            <select value={form.default} onChange={handleChange('default')} className="w-full border rounded px-3 py-2">
              <option value="no">no</option>
              <option value="yes">yes</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Contact Type <span className="text-red-500">*</span></span>
            </label>
            <select value={form.contact} onChange={handleChange('contact')} className="w-full border rounded px-3 py-2">
              <option value="cellular">cellular</option>
              <option value="telephone">telephone</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Last Contact Month <span className="text-red-500">*</span></span>
            </label>
            <select value={form.month} onChange={handleChange('month')} className="w-full border rounded px-3 py-2">
              <option value="">Select month</option>
              <option value="jan">Jan</option>
              <option value="feb">Feb</option>
              <option value="mar">Mar</option>
              <option value="apr">Apr</option>
              <option value="may">May</option>
              <option value="jun">Jun</option>
              <option value="jul">Jul</option>
              <option value="aug">Aug</option>
              <option value="sep">Sep</option>
              <option value="oct">Oct</option>
              <option value="nov">Nov</option>
              <option value="dec">Dec</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Last Contact Day (1-31) <span className="text-red-500">*</span></span>
            </label>
            <input type="number" min="1" max="31" value={form.day} onChange={handleChange('day')} className={`w-full border rounded px-3 py-2 ${errors.day ? 'border-red-500' : ''}`} />
            {errors.day && <div className="text-sm text-red-700 mt-1">{errors.day}</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Contact Duration (seconds) <span className="text-red-500">*</span></span>
            </label>
            <input type="number" value={form.duration} onChange={handleChange('duration')} className={`w-full border rounded px-3 py-2 ${errors.duration ? 'border-red-500' : ''}`} />
            {errors.duration && <div className="text-sm text-red-700 mt-1">{errors.duration}</div>}

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Promotion Notes <span className="text-red-500">*</span></span>
            </label>
            <textarea value={form.notes.join('\n')} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value.split('\n').filter(Boolean) }))} className={`w-full border rounded px-3 py-2 h-28 ${errors.notes ? 'border-red-500' : ''}`} />
            {errors.notes && <div className="text-sm text-red-700 mt-1">{errors.notes}</div>}
          </div>

          {/* Wide area for advanced numeric fields */}
          <div className="md:col-span-2 mt-3 bg-gray-50 border rounded p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Advanced Fields</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600">Total Campaign Contacts <span className="text-red-500">*</span></label>
                <input type="number" value={form.campaign} onChange={handleChange('campaign')} className={`w-full border rounded px-2 py-2 ${errors.campaign ? 'border-red-500' : ''}`} />
                {errors.campaign && <div className="text-sm text-red-700 mt-1">{errors.campaign}</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Previous Contacts <span className="text-red-500">*</span></label>
                <input type="number" value={form.previous} onChange={handleChange('previous')} className={`w-full border rounded px-2 py-2 ${errors.previous ? 'border-red-500' : ''}`} />
                {errors.previous && <div className="text-sm text-red-700 mt-1">{errors.previous}</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Days Since Last Contact (-1 = never) <span className="text-red-500">*</span></label>
                <input type="number" value={form.pdays} onChange={handleChange('pdays')} className={`w-full border rounded px-2 py-2 ${errors.pdays ? 'border-red-500' : ''}`} />
                {errors.pdays && <div className="text-sm text-red-700 mt-1">{errors.pdays}</div>}
              </div>

              <div>
                <label className="text-xs text-gray-600">Last Campaign Result <span className="text-red-500">*</span></label>
                <select value={form.poutcome} onChange={handleChange('poutcome')} className="w-full border rounded px-2 py-2">
                  <option value="">Select result</option>
                  <option value="success">success</option>
                  <option value="failure">failure</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Employment Variation Rate <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={form.emp_var_rate} onChange={handleChange('emp_var_rate')} className={`w-full border rounded px-2 py-2 ${errors.emp_var_rate ? 'border-red-500' : ''}`} />
                {errors.emp_var_rate && <div className="text-sm text-red-700 mt-1">{errors.emp_var_rate}</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Consumer Price Index <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={form.cons_price_idx} onChange={handleChange('cons_price_idx')} className={`w-full border rounded px-2 py-2 ${errors.cons_price_idx ? 'border-red-500' : ''}`} />
                {errors.cons_price_idx && <div className="text-sm text-red-700 mt-1">{errors.cons_price_idx}</div>}
              </div>

              <div>
                <label className="text-xs text-gray-600">Consumer Confidence Index <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={form.cons_conf_idx} onChange={handleChange('cons_conf_idx')} className={`w-full border rounded px-2 py-2 ${errors.cons_conf_idx ? 'border-red-500' : ''}`} />
                {errors.cons_conf_idx && <div className="text-sm text-red-700 mt-1">{errors.cons_conf_idx}</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Euribor 3 Month Rate <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" value={form.euribor3m} onChange={handleChange('euribor3m')} className={`w-full border rounded px-2 py-2 ${errors.euribor3m ? 'border-red-500' : ''}`} />
                {errors.euribor3m && <div className="text-sm text-red-700 mt-1">{errors.euribor3m}</div>}
              </div>
              <div>
                <label className="text-xs text-gray-600">Number of Employees <span className="text-red-500">*</span></label>
                <input type="number" step="1" value={form.nr_employed} onChange={handleChange('nr_employed')} className={`w-full border rounded px-2 py-2 ${errors.nr_employed ? 'border-red-500' : ''}`} />
                {errors.nr_employed && <div className="text-sm text-red-700 mt-1">{errors.nr_employed}</div>}
              </div>

            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">{message}</div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setForm(defaultForm)} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">{saving ? 'Saving...' : 'Save Customer'}</button>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
};

export default CustomerEntryContainer;
