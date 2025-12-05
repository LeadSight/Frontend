import React, { useState } from 'react';
import { addCustomer as addCustomerApi } from '../../api/api';
import { useCustomers } from '../../hooks/useCustomers';
import { useAuth } from '../../hooks/useAuth';

const defaultForm = {
  customerName: '',
  hasLoan: 'no',
  balance: 0,
  age: '',
  job: '',
  marital: 'single',
  education: '',
  defaultValue: 'no', // named this way to prevent conflicts with keywords
  housing: 'no',
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
};

const CustomerEntryContainer = () => {
  const { refreshCustomers } = useCustomers();
  const { token } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);

  const FIELD_INFO_EN = {
  "Customer Name": 
    "Enter the customer’s full name as shown on their documents. Avoid abbreviations unless it is their legal format.",
  
  "Age": 
    "Customer’s age in whole numbers. Must be greater than 0. Used for demographic and segmentation analysis.",
  
  "Job": 
    "Customer’s occupation or job category (e.g., management, technician, admin, blue-collar). Helps classify economic status.",
  
  "Marital Status": 
    "Select marital status: single, married, or divorced. Useful for understanding household financial behavior.",
  
  "Education": 
    "Customer’s highest completed education level: basic.4y, high.school, basic.6y, basic.9y, professional.course, unknown, university.degree, illiterate. Helps assess financial literacy trends.",
  
  "Personal Loan": 
    "Indicates whether the customer currently has any active personal loan. Select 'yes' or 'no'.",
  
  "Balance": 
    "Average annual account balance (in EUR). Helps measure customer liquidity and financial capacity.",
  
  "Housing Loan": 
    "Indicates whether the customer has an ongoing housing/mortgage loan. Select 'yes' or 'no'.",
  
  "Default (Delinquent Payment)": 
    "Shows if the customer has a history of credit/payment default. Select 'yes' if ever defaulted; otherwise 'no'.",
  
  "Contact Type": 
    "How the last contact was made: via cellular phone or landline telephone. Affects communication strategy.",
  
  "Last Contact Month": 
    "Month of the last contact with the customer (Jan–Dec). Used in marketing campaign timing analysis.",
  
  "Last Contact Day": 
    "The exact day of the month (Mon - Sun) when the last contact occurred.",
  
  "Contact Duration": 
    "Length of the last contact in seconds. Longer calls often indicate higher customer engagement.",
  
  "Total Campaign Contacts": 
    "Number of times this customer was contacted during the current campaign. Numeric.",
  
  "Days Since Last Contact": 
    "How many days since customer was previously contacted from an earlier campaign. Use -1 if never contacted.",
  
  "Previous Contacts": 
    "Total number of contacts made with this customer before the current campaign.",
  
  "Previous Campaign Result": 
    "Outcome of the previous marketing campaign: success, failure, or other.",
  
  "Consumer Price Index": 
    "Monthly Consumer Price Index value. Indicates inflation and affects customer purchasing power.",
  
  "Consumer Confidence Index": 
    "Monthly Consumer Confidence Index value. Reflects public optimism or pessimism regarding the economy.",
  
  "Euribor (3 Months)": 
    "Euribor 3-month interest rate. Used as an economic indicator influencing loan and savings behavior.",
  
  "Number of Employed": 
    "Quarterly employment index measuring the number of active workers. Higher values indicate stronger employment conditions.",
  
  "Employment Variation Rate": 
    "Employment variation rate (quarterly). Indicates changes in job market conditions, helpful in economic forecasting.",
};

  const handleChange = (k) => (e) => {
    const val = e?.target?.value ?? e;
    setForm((p) => ({ ...p, [k]: val }));
  };

  const validate = () => {
    const requiredFields = [
      'customerName', 'age', 'job', 'marital', 'education', 'defaultValue', 'balance', 'housing', 'hasLoan', 'contact', 'month', 'day', 'duration', 'campaign', 'pdays', 'previous', 'poutcome', 'emp_var_rate', 'cons_price_idx', 'cons_conf_idx', 'euribor3m', 'nr_employed'
    ];

    const nextErrors = {};
    requiredFields.forEach((k) => {
      const val = form[k];
      // treat empty string/null/undefined as missing. pdays may be -1 allowed but still required
      if (val === '' || val === null || typeof val === 'undefined') {
        nextErrors[k] = 'Field ini wajib diisi';
      } else if (k === 'age' && Number(val) <= 0) {
        nextErrors[k] = 'Masukkan usia yang valid (> 0)';
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
        setMessage(`Beberapa field wajib belum diisi. Silakan lengkapi sebelum menyimpan. ${JSON.stringify(errors, null, 2)}`);
        setSaving(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
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

      // call backend if token available
      if (token) {
        try {
          const res = await addCustomerApi(token, payload);
          if (res?.error) setMessage('Saved locally but server rejected the request.');
          else setMessage('Saved successfully.');
          refreshCustomers();
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
            <p className="text-sm text-gray-500 mb-6">Add new customer data</p>
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
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="unknown">Unknown</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Education <span className="text-red-500">*</span></span>
            </label>
            <select
              value={form.education} onChange={handleChange('education')} className="w-full border rounded px-3 py-2"
            >
              <option value="">Select education level</option>
              <option value="basic.4y">basic.4y</option>
              <option value="high.school">high.school</option>
              <option value="basic.6y">basic.6y</option>
              <option value="basic.9y">basic.9y</option>
              <option value="professional.course">professional.course</option>
              <option value="unknown">unknown</option>
              <option value="university.degree">university.degree</option>
              <option value="illiterate">illiterate</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Personal Loan <span className="text-red-500">*</span></span>
            </label>
            <select value={form.hasLoan} onChange={handleChange('hasLoan')} className="w-full border rounded px-3 py-2">
              <option value="no">no</option>
              <option value="yes">yes</option>
              <option value="unknown">unknown</option>
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
              <option value="unknown">unknown</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Default (delinquent payment) <span className="text-red-500">*</span></span>
            </label>
            <select value={form.defaultValue} onChange={handleChange('defaultValue')} className="w-full border rounded px-3 py-2">
              <option value="no">no</option>
              <option value="yes">yes</option>
              <option value="unknown">unknown</option>
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

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mt-4">
              <span>Last Contact Day <span className="text-red-500">*</span></span>
            </label>
            <select
              value={form.day} onChange={handleChange('day')} className={"w-full border rounded px-3 py-2"}
            >
              <option value="">Select day</option>
              <option value="mon">Mon</option>
              <option value="tue">Tue</option>
              <option value="wed">Wed</option>
              <option value="thu">Thu</option>
              <option value="fri">Fri</option>
              <option value="sat">Sat</option>
              <option value="sun">Sun</option>
            </select>

            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span>Contact Duration (seconds) <span className="text-red-500">*</span></span>
            </label>
            <input type="number" value={form.duration} onChange={handleChange('duration')} className={`w-full border rounded px-3 py-2 ${errors.duration ? 'border-red-500' : ''}`} />
            {errors.duration && <div className="text-sm text-red-700 mt-1">{errors.duration}</div>}
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
                  <option value="nonexistent">nonexistent</option>
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