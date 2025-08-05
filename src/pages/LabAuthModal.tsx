import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import CountryFlag from 'react-country-flag';
import { getData, Country } from 'country-list';
import { useEffect } from 'react';
import { getBrowserCountryCode } from '../utils/getBrowserCountry';

// Replace hardcoded countryFlags with dynamic list
const countryFlags: { code: string; name: string }[] = getData().map((c: Country) => ({ code: c.code, name: c.name }));


export default function LabAuthModal({ open, onOpenChange, onAuthSuccess }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: (profile?: { username: string, country_flag: string }) => void;
}) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [countryFlag, setCountryFlag] = useState(countryFlags[0].code);
  const [countryList, setCountryList] = useState(countryFlags);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, detect browser country and set as top and selected
  useEffect(() => {
    if (mode !== 'signup') return;
    const browserCountry = getBrowserCountryCode();
    if (browserCountry) {
      // Find the country in the list
      const idx = countryFlags.findIndex(f => f.code === browserCountry);
      if (idx !== -1) {
        setCountryFlag(browserCountry);
        // Move to top
        setCountryList([countryFlags[idx], ...countryFlags.filter((_, i) => i !== idx)]);
      } else {
        setCountryList(countryFlags);
      }
    } else {
      setCountryList(countryFlags);
    }
  }, [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (mode === 'login') {
      let emailToUse = loginId;
      if (!loginId.includes('@')) {
        // Lookup email by username from profiles table
        const { data, error: userError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', loginId.trim())
          .maybeSingle();
        if (userError || !data?.email) {
          setError('Could not find email for this username.');
          setLoading(false);
          return;
        }
        emailToUse = data.email;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
      if (error) setError(error.message);
      else {
        onOpenChange(false);
        onAuthSuccess?.();
      }
    } else {
      // Validate username
      if (!username.trim()) {
        setError('Username is required.');
        setLoading(false);
        return;
      }
      // Check for duplicate username
      const { data: existing, error: usernameError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.trim())
        .maybeSingle();
      if (usernameError) {
        setError('Error checking username.');
        setLoading(false);
        return;
      }
      if (existing) {
        setError('Username is already taken.');
        setLoading(false);
        return;
      }
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email: loginId, password });
      if (error || !data.user) {
        setError(error?.message || 'Sign up failed.');
        setLoading(false);
        return;
      }
      // Insert into profiles (now includes email)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, username: username.trim(), country_flag: countryFlag, email: loginId.trim() });
      if (profileError) {
        setError('Sign up succeeded, but failed to save profile.');
        setLoading(false);
        return;
      }
      // Automatically sign in after sign up
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: loginId, password });
      if (signInError) {
        setError('Sign up succeeded, but failed to sign in.');
        setLoading(false);
        return;
      }
      onOpenChange(false);
      onAuthSuccess?.({ username: username.trim(), country_flag: countryFlag });
    }
    setLoading(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={{ background: 'rgba(0,0,0,0.55)', position: 'fixed', inset: 0, zIndex: 10001 }} />
        <Dialog.Content style={{
          background: '#18171c',
          color: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          padding: '2.5rem 2.2rem 2.2rem 2.2rem',
          width: 340,
          maxWidth: '90vw',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10002,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Dialog.Title style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 14, letterSpacing: '-0.5px', color: '#f5f5f7', lineHeight: 1.2 }}>
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </Dialog.Title>
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginId}
                  onChange={e => setLoginId(e.target.value)}
                  required
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: '1.5px solid #444',
                    fontSize: 16,
                    background: '#222',
                    color: '#fff',
                    marginBottom: 8,
                  }}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: '1.5px solid #444',
                    fontSize: 16,
                    background: '#222',
                    color: '#fff',
                    marginBottom: 8,
                  }}
                />
                
                
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: '1.5px solid #444',
                    fontSize: 16,
                    background: '#222',
                    color: '#fff',
                    marginBottom: 8,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CountryFlag
                    countryCode={countryFlag}
                    svg
                    style={{ width: 40, height: 40 }}
                    title={countryFlag}
                  />
                    <select
                    value={countryFlag}
                    onChange={e => setCountryFlag(e.target.value)}
                    required
                    style={{
                      background: '#222',
                      color: '#fff',
                      border: '1.5px solid #444',
                      borderRadius: 8,
                      fontSize: 16,
                      padding: '0.5rem 1rem',
                      minWidth: 120,
                    }}
                    >
                    {countryList.map((flag: { code: string; name: string }) => (
                      <option key={flag.code} value={flag.code}>
                      {flag.name}
                      </option>
                    ))}
                    </select>
                </div>
              </>
            )}
            {mode === 'login' && (
              <>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={loginId}
                  onChange={e => setLoginId(e.target.value)}
                  required
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: '1.5px solid #444',
                    fontSize: 16,
                    background: '#222',
                    color: '#fff',
                    marginBottom: 8,
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: '1.5px solid #444',
                    fontSize: 16,
                    background: '#222',
                    color: '#fff',
                    marginBottom: 8,
                  }}
                />
              </>
            )}
            {error && <div style={{ color: '#ff6b6b', marginBottom: 8, fontSize: 15 }}>{error}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#fff',
                color: '#18171c',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem',
                fontWeight: 700,
                fontSize: 18,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: 8,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {loading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Log In' : 'Sign Up')}
            </button>
          </form>
          <div style={{ marginTop: 8, fontSize: 13, color: '#b3b3b3', fontWeight: 400, letterSpacing: '-0.1px', display: 'flex', alignItems: 'center', gap: 4 }}>
            {mode === 'login' ? (
              <>
                <span>Don&apos;t have an account?</span>
                <button onClick={() => setMode('signup')} style={{ color: '#5e5eff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500, fontSize: 13, padding: 0 }}>Sign Up</button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <button onClick={() => setMode('login')} style={{ color: '#5e5eff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500, fontSize: 13, padding: 0 }}>Log In</button>
              </>
            )}
          </div>
          <Dialog.Close asChild>
            <button style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }} aria-label="Close">×</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 