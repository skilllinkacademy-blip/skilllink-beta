import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();
  const { role: initialRole, mode: initialMode } = router.query;
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    password: '',
    area: '',
    specialties: [] as string[],
    experience: '',
    bio: '',
    goal: ''
  });

  const areas = ['פתח תקווה', 'תל אביב', 'מרכז', 'צפון', 'דרום'];
  const professions = ['אינסטלטור / צנרת', 'חשמלאי / טכנאי חשמל', 'טכנאי מחשבים / סלולר', 'נגר / רהיטים', 'רתך / מסגר', 'ספר גברים', 'שף / בישול מקצועי', 'נהג מקצועי / נהג רכב כבד', 'מאמן כושר / מדריך ספורט', 'צבע / שיפוצים', 'מכונאי רכב / אופנועים', 'תיקוני בית / עבודות שירותי בית', 'אחר'];
  const experienceOptions = ['מתחיל (0-2 שנים)', 'בינוני (2-5 שנים)', 'מנוסה (5+ שנים)'];
  const goals = ['למצוא עבודה', 'למצוא חניכה / ללמוד', 'להכיר אנשי מקצוע', 'לשתף ידע'];

  useEffect(() => {
    if (initialMode === 'login') setMode('login');
    if (initialRole) {
      setRole(initialRole as string);
      setStep(2);
    } else if (initialMode === 'login') {
      setStep(2);
    }
  }, [initialMode, initialRole]);

  const toggleSpecialty = (s: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter(item => item !== s)
        : [...prev.specialties, s]
    }));
  };

  const handleAuthAction = async () => {
    setError('');
    setLoading(true);
    try {
      const isEmail = formData.contact.includes('@');
      const authEmail = isEmail ? formData.contact : `${formData.contact}@skilllink.phone`;

      if (mode === 'login') {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: formData.password,
        });
        if (loginError) throw loginError;
        router.push('/feed');
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: authEmail,
          password: formData.password,
        });

        if (authError) {
          if (authError.message.toLowerCase().includes('already registered')) {
            setError('המשתמש כבר קיים במערכת. אנא עברו למסך התחברות.');
            setLoading(false);
            return;
          }
          throw authError;
        }

        if (!authData?.user?.id) throw new Error('שגיאת הרשמה. נסה שוב.');
        setUserId(authData.user.id);
        setStep(3);
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'פרטי התחברות שגויים' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileFinish = async () => {
    if (!userId) return;
    setError('');
    setLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{
          id: userId,
          full_name: formData.fullName,
          role: role,
          city: formData.area,
          profession: role === 'mentor' ? formData.specialties.join(', ') : null,
          bio: formData.bio,
          phone: !formData.contact.includes('@') ? formData.contact : null,
          experience_years: role === 'mentor' ? formData.experience : null,
          learning_goal: role === 'student' ? formData.goal : null
        }]);

      if (profileError) throw profileError;
      router.push('/feed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>SkillLink</h1>
      <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '50px' }}>בחר את סוג החשבון שלך</p>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div onClick={() => { setRole('mentor'); setStep(2); }} style={{ padding: '40px', borderRadius: '25px', border: '3px solid #000', cursor: 'pointer', background: role === 'mentor' ? '#e6b800' : '#fff' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>אני בעל מקצוע</h3>
          <p>מחפש לשתף ידע ולמצוא הזדמנויות</p>
        </div>
        <div onClick={() => { setRole('student'); setStep(2); }} style={{ padding: '40px', borderRadius: '25px', border: '3px solid #000', cursor: 'pointer', background: role === 'student' ? '#e6b800' : '#fff' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>אני לומד / חניך</h3>
          <p>מחפש ללמוד מקצוע ולהתפתח</p>
        </div>
      </div>
      <button onClick={() => { setMode('login'); setStep(2); }} style={{ marginTop: '40px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>כבר יש לך חשבון? התחבר כאן</button>
    </div>
  );

  const renderAuthForm = () => (
    <div>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '30px', textAlign: 'center' }}>{mode === 'login' ? 'התחברות' : 'יצירת חשבון'}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {mode === 'signup' && (
          <input placeholder="שם מלא" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} style={{ padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }} />
        )}
        <input placeholder="אימייל או טלפון" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} style={{ padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }} />
        <input type="password" placeholder="סיסמה" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }} />
        
        {error && <p style={{ color: 'red', textAlign: 'center', background: '#fff0f0', padding: '10px', borderRadius: '10px' }}>{error}</p>}
        
        <button onClick={handleAuthAction} disabled={loading} style={{ padding: '22px', fontSize: '1.4rem', fontWeight: 800, borderRadius: '50px', border: 'none', background: '#e6b800', color: '#000', cursor: 'pointer', marginTop: '20px' }}>
          {loading ? 'טוען...' : (mode === 'login' ? 'התחבר' : 'המשך')}
        </button>

        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>
          {mode === 'login' ? 'אין לך חשבון? צור אחד עכשיו' : 'כבר רשום? התחבר כאן'}
        </button>

        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#666', marginTop: '10px' }}>חזור אחורה</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>{role === 'mentor' ? 'פרופיל מקצועי' : 'מה המטרה שלך?'}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <select value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem', background: '#fff' }}>
          <option value="">בחר אזור פעילות</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <div>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '15px' }}>{role === 'mentor' ? 'תחומי התמחות:' : 'תחומי עניין:'}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {professions.map(p => (
              <div key={p} onClick={() => toggleSpecialty(p)} style={{ padding: '12px 20px', borderRadius: '30px', border: '2px solid', borderColor: formData.specialties.includes(p) ? '#000' : '#eee', background: formData.specialties.includes(p) ? '#000' : '#fff', color: formData.specialties.includes(p) ? '#fff' : '#000', fontWeight: 600, cursor: 'pointer' }}>{p}</div>
            ))}
          </div>
        </div>

        {role === 'mentor' ? (
          <>
            <select value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }}>
              <option value="">כמה שנות ניסיון יש לך?</option>
              {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <textarea placeholder="ספר קצת על עצמך..." value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem', minHeight: '120px', resize: 'none' }} />
          </>
        ) : (
          <select value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value })} style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1.1rem' }}>
            <option value="">מה המטרה שלך?</option>
            {goals.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        )}

        {error && <p style={{ color: 'red', textAlign: 'center', background: '#fff0f0', padding: '10px', borderRadius: '10px' }}>{error}</p>}
        
        <button onClick={handleProfileFinish} disabled={loading} style={{ padding: '22px', fontSize: '1.4rem', fontWeight: 800, borderRadius: '50px', border: 'none', background: '#e6b800', color: '#000', cursor: 'pointer', marginTop: '20px' }}>
          {loading ? 'מעדכן...' : 'סיום והרשמה'}
        </button>

        <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600, textAlign: 'center' }}>חזור לשלב הקודם</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff', direction: 'rtl', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: '40px', height: '6px', borderRadius: '10px', background: s <= step ? '#000' : '#eee' }} />
          ))}
        </div>
        {step === 1 && renderStep1()}
        {step === 2 && renderAuthForm()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}
