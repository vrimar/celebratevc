import { useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { Check, X } from 'lucide-react';

const Select = dynamic(() => import('react-select'), { ssr: false });

const ENTREE_OPTIONS = [
  {
    value: 'beef',
    label: 'Filetto di Manzo',
    description: 'Pan-roasted beef tenderloin, finished with a goat cheese, panko gremolata, and a rich chianti wine reduction',
  },
  {
    value: 'veal',
    label: 'Vitello',
    description: 'Grilled bone-in veal chop, finished with lemon gremolata',
  },
  {
    value: 'chicken',
    label: 'Pollo con Funghi',
    description: 'Chicken supreme topped with sautéed wild mushrooms, finished in a white wine and shallot jus',
  },
  {
    value: 'salmon',
    label: 'Salmone con Limone',
    description: 'Oven-roasted salmon with a refined lemon and herb infusion',
  },
];

const formatOptionLabel = ({ label, description }) => (
  <div className="entree-option">
    <div className="entree-option-name">{label}</div>
    <div className="entree-option-desc">{description}</div>
  </div>
);

const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: state.isFocused ? 'rgba(245, 230, 211, 0.08)' : 'rgba(245, 230, 211, 0.05)',
    border: `1px solid ${state.isFocused ? '#c9a961' : 'rgba(245, 230, 211, 0.15)'}`,
    borderRadius: 0,
    boxShadow: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease, background 0.3s ease',
    '&:hover': {
      borderColor: 'rgba(245, 230, 211, 0.4)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0.5rem 1rem',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#f5e6d3',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#b8a589',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#c9a961' : 'rgba(201, 169, 97, 0.6)',
    padding: '0 1rem',
    transition: 'color 0.3s ease',
    '&:hover': { color: '#c9a961' },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menu: (base) => ({
    ...base,
    background: '#2a1810',
    border: '1px solid rgba(245, 230, 211, 0.15)',
    borderRadius: 0,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    marginTop: '2px',
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, { isFocused, isSelected, isActive }) => ({
    ...base,
    background: isActive
      ? 'rgba(201, 169, 97, 0.22)'
      : isSelected
        ? 'rgba(201, 169, 97, 0.12)'
        : isFocused
          ? 'rgba(245, 230, 211, 0.06)'
          : 'transparent',
    color: '#f5e6d3',
    cursor: 'pointer',
    padding: '0.65rem 1rem',
    borderBottom: '1px solid rgba(245, 230, 211, 0.07)',
    fontSize: '0.9rem',
    transition: 'background 0.2s ease',
    ':active': { background: 'rgba(201, 169, 97, 0.22)' },
    '&:last-child': { borderBottom: 'none' },
  }),
  input: (base) => ({
    ...base,
    color: '#f5e6d3',
  }),
};

const MENU = [
  {
    course: 'First Course',
    note: 'for the table',
    items: [
      { name: 'Focaccia', desc: 'with ricotta, honey, and EVOO' },
    ],
  },
  {
    course: 'Individual Salad',
    items: [
      { name: 'Arugula', desc: 'with fennel, radicchio, pear, and parmigiano — fig balsamic or lemon vinaigrette' },
    ],
  },
  {
    course: 'To Share',
    note: 'Family Style',
    items: [
      { name: 'Salumi di Casa', desc: 'house-cured prosciutto, capocollo & soppressata' },
      { name: 'Giardiniera e Formaggio', desc: 'roasted red peppers, marinated olives, Italian cheeses' },
      { name: 'Fritto Misto', desc: 'calamari, shrimp, zucchini, semolina flour, peperoncino, lemon aioli' },
    ],
  },
  {
    course: 'Second Course',
    items: [
      { name: 'Rigatoni al Pomodoro', desc: 'house-made rigatoni, tomato sugo, fresh basilico' },
    ],
  },
];

export default function RSVP() {
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [allergyOpen, setAllergyOpen] = useState([false, false, false]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: '',
    guests: '1',
    entrees: [null, null, null],
    allergies: ['', '', ''],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEntreeChange = (index, option) => {
    const entrees = [...formData.entrees];
    entrees[index] = option;
    setFormData({ ...formData, entrees });
  };

  const handleAllergyChange = (index, value) => {
    const allergies = [...formData.allergies];
    allergies[index] = value;
    setFormData({ ...formData, allergies });
  };

  const toggleAllergy = (index) => {
    setAllergyOpen((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Static site: store locally. For production, replace with Formspree, Netlify Forms,
    // Google Forms, or a serverless endpoint.
    console.log('RSVP submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="rsvp-wrap">
          <div className="success">
            <div className="success-icon">✦</div>
            <h2 className="success-title">Thank you</h2>
            <p className="success-text">
              We've received your response and can't wait to celebrate with you.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="rsvp-wrap">
        <div className="container">
          <div className="page-header">
            <div className="page-eyebrow">Kindly Respond</div>
            <h1 className="page-title">By July 1, 2026</h1>
            <div className="rsvp-divider"></div>
            <p className="page-subtitle">
              Please let us know if you'll be joining us to celebrate.
            </p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="name">Full Name</label>
              <input
                className="input"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="email">Email Address</label>
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Will You Attend?</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="yes"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === 'yes'}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="yes"><Check size={22} style={{ verticalAlign: 'middle', marginRight: 12, color: '#c9a961' }} />Accept</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="no"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === 'no'}
                    onChange={handleChange}
                  />
                  <label htmlFor="no"><X size={22} style={{ verticalAlign: 'middle', marginRight: 12, color: '#c9a961' }} />Decline</label>
                </div>
              </div>
            </div>

            {formData.attendance === 'yes' && (
              <>
                <div className="form-group">
                  <label className="label">Number of Guests</label>
                  <div className="radio-group radio-group--inline">
                    {[['1', '1'], ['2', '2'], ['3', '3']].map(([val, text]) => (
                      <div key={val} className="radio-option">
                        <input
                          type="radio"
                          id={`guests-${val}`}
                          name="guests"
                          value={val}
                          checked={formData.guests === val}
                          onChange={handleChange}
                        />
                        <label htmlFor={`guests-${val}`}>{text}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group entree-group">
                  <p className="entree-intro">
                    Kindly indicate your entrée choice. All entrées are accompanied by roasted potatoes and a selection of seasonal vegetables.
                  </p>
                  <button type="button" className="menu-link" onClick={() => setMenuOpen(true)}>
                    View full menu
                  </button>
                  {Array.from({ length: Number(formData.guests) }).map((_, i) => (
                    <div key={i} className="guest-entree">
                      {Number(formData.guests) > 1 && (
                        <div className="guest-entree-heading">Guest {['one', 'two', 'three'][i]}</div>
                      )}
                      <div className="form-group">
                        <label className="label" htmlFor={`entree-${i}`}>Entrée Selection</label>
                        <Select
                          inputId={`entree-${i}`}
                          options={ENTREE_OPTIONS}
                          value={formData.entrees[i]}
                          onChange={(opt) => handleEntreeChange(i, opt)}
                          formatOptionLabel={formatOptionLabel}
                          styles={selectStyles}
                          placeholder="Select an entrée…"
                          isSearchable={false}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0, marginTop: '-1.25rem' }}>
                        {!allergyOpen[i] ? (
                          <button
                            type="button"
                            className="allergy-toggle"
                            onClick={() => toggleAllergy(i)}
                          >
                            + Add dietary requirements
                          </button>
                        ) : (
                          <>
                            <label className="label" htmlFor={`allergies-${i}`}>
                              Food Allergies, Intolerances, or Dietary Requirements
                            </label>
                            <textarea
                              className="textarea"
                              id={`allergies-${i}`}
                              value={formData.allergies[i]}
                              onChange={(e) => handleAllergyChange(i, e.target.value)}
                              rows={2}
                              autoFocus
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                </div>


              </>
            )}

            <button type="submit" className="submit-button">
              Send Response
            </button>
          </form>
        </div>
      </section>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="menu-dialog-close" onClick={() => setMenuOpen(false)} aria-label="Close">✕</button>
            <h3 className="menu-dialog-title">Dinner Menu</h3>
            <div className="menu-dialog-divider" />
            {MENU.map((section) => (
              <div key={section.course} className="menu-section">
                <div className="menu-section-header">
                  <span className="menu-section-course">{section.course}</span>
                  {section.note && <span className="menu-section-note">{section.note}</span>}
                </div>
                <ul className="menu-items">
                  {section.items.map((item) => (
                    <li key={item.name} className="menu-item">
                      <span className="menu-item-name">{item.name}</span>
                      <span className="menu-item-desc">{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
