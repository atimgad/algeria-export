'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function TestSupabasePage() {
  const [status, setStatus] = useState('Test en cours...');
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test123456');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Vérifier la session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setStatus('❌ Erreur session: ' + sessionError.message);
        return;
      }

      setSession(sessionData.session);
      
      // Test 2: Afficher les infos
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Non défini';
      const hasKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Présente' : '❌ Manquante';
      
      setStatus(`
        🔧 STATUT SUPABASE :
        --------------------
        ✅ Connexion établie !
        
        URL: ${supabaseUrl}
        Clé API: ${hasKey}
        
        Session: ${sessionData.session ? '✅ Utilisateur connecté' : '❌ Non connecté'}
        Email: ${sessionData.session?.user?.email || 'Aucun'}
        
        --------------------
        TEST COMPLET !
      `);
      
    } catch (error: any) {
      setStatus('❌ ERREUR CRITIQUE: ' + error.message);
    }
  };

  const testSignUp = async () => {
    try {
      setStatus('Inscription en cours...');
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setStatus('❌ Erreur inscription: ' + error.message);
      } else {
        setStatus(`✅ Inscription réussie !
          Email: ${data.user?.email}
          ID: ${data.user?.id}
          Vérifiez votre email pour confirmer.`);
      }
    } catch (error: any) {
      setStatus('❌ Erreur: ' + error.message);
    }
  };

  const testSignIn = async () => {
    try {
      setStatus('Connexion en cours...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setStatus('❌ Erreur connexion: ' + error.message);
      } else {
        setSession(data.session);
        setStatus(`✅ Connexion réussie !
          Utilisateur: ${data.user?.email}
          Redirection vers /dashboard...`);
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error: any) {
      setStatus('❌ Erreur: ' + error.message);
    }
  };

  const testSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setStatus('✅ Déconnexion réussie !');
  };

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'monospace',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{color: '#0A2E52', fontSize: '32px', marginBottom: '20px'}}>
        🔧 Test Supabase - AlgeriaExport
      </h1>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        border: '1px solid #ddd'
      }}>
        <pre style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {status}
        </pre>
      </div>

      <div style={{
        backgroundColor: '#e9f7ef',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h3 style={{color: '#0E5C4A', marginBottom: '15px'}}>Test d'authentification</h3>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '10px'
            }}
          />
          
          <label style={{display: 'block', marginBottom: '5px'}}>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
        </div>
        
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <button
            onClick={testSignUp}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0A2E52',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tester Inscription
          </button>
          
          <button
            onClick={testSignIn}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0E5C4A',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tester Connexion
          </button>
          
          <button
            onClick={testSignOut}
            style={{
              padding: '10px 20px',
              backgroundColor: '#C6A75E',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
          
          <button
            onClick={testConnection}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Rafraîchir
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h4 style={{color: '#856404', marginBottom: '10px'}}>Instructions :</h4>
        <ol style={{marginLeft: '20px'}}>
          <li>Cliquez sur "Tester Inscription" pour créer un compte test</li>
          <li>Vérifiez votre email (si configuré dans Supabase)</li>
          <li>Cliquez sur "Tester Connexion" pour vous connecter</li>
          <li>Vérifiez que la session s'affiche correctement</li>
        </ol>
      </div>

      <div style={{marginTop: '30px'}}>
        <h3>📁 Navigation rapide :</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          marginTop: '15px'
        }}>
          <a href="/" style={linkStyle}>🏠 Accueil</a>
          <a href="/login" style={linkStyle}>🔐 Login</a>
          <a href="/register" style={linkStyle}>📝 Register</a>
          <a href="/dashboard" style={linkStyle}>📊 Dashboard</a>
          <a href="/test" style={linkStyle}>🧪 Test Simple</a>
        </div>
      </div>
    </div>
  );
}

const linkStyle = {
  display: 'block',
  padding: '12px',
  backgroundColor: '#f8f9fa',
  color: '#0A2E52',
  textDecoration: 'none',
  borderRadius: '5px',
  textAlign: 'center',
  border: '1px solid #ddd'
};