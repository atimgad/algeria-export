'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tableName, setTableName] = useState('profiles')
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM profiles LIMIT 5;')
  const [queryResult, setQueryResult] = useState<any>(null)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
      
      if (error) throw error
      
      setResult({
        success: true,
        message: 'Connexion Supabase réussie !',
        details: 'La connexion à la base de données est fonctionnelle.'
      })
    } catch (err: any) {
      setError(err.message)
      setResult({
        success: false,
        message: 'Erreur de connexion',
        details: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTableData = async () => {
    setLoading(true)
    setError(null)
    setQueryResult(null)
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(5)
      
      if (error) throw error
      
      setQueryResult({
        data,
        count: data?.length || 0
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const executeSql = async () => {
    setLoading(true)
    setError(null)
    setQueryResult(null)
    
    try {
      // Note: Supabase JS client ne supporte pas le SQL brut directement
      // On va extraire la table depuis la requête pour l'exemple
      const match = sqlQuery.match(/FROM\s+(\w+)/i)
      if (!match) {
        throw new Error('Impossible de déterminer la table dans la requête')
      }
      
      const table = match[1]
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(5)
      
      if (error) throw error
      
      setQueryResult({
        data,
        count: data?.length || 0,
        note: 'Requête simplifiée (le client JS ne supporte pas le SQL brut)'
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const linkStyle = {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center' as const,
    border: '1px solid #ddd'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }

  const headerStyle = {
    borderBottom: '2px solid #003153',
    paddingBottom: '10px',
    marginBottom: '30px'
  }

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    border: '1px solid #eaeaea'
  }

  const buttonStyle = {
    backgroundColor: '#003153',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500' as const
  }

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '10px'
  }

  const successStyle = {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #c3e6cb',
    marginBottom: '20px'
  }

  const errorStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
    marginBottom: '20px'
  }

  const preStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '13px',
    border: '1px solid #eaeaea',
    maxHeight: '400px'
  }

  const navStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap' as const
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ color: '#003153', marginBottom: '5px' }}>🧪 Test de connexion Supabase</h1>
        <p style={{ color: '#666', margin: 0 }}>Vérification de la configuration de la base de données</p>
      </div>

      <div style={navStyle}>
        <a href="/" style={linkStyle}>🏠 Accueil</a>
        <a href="/login" style={linkStyle}>🔐 Login</a>
        <a href="/register" style={linkStyle}>📝 Register</a>
        <a href="/dashboard" style={linkStyle}>📊 Dashboard</a>
        <a href="/exporters" style={linkStyle}>🏭 Exportateurs</a>
        <a href="/rfq" style={linkStyle}>📄 RFQ</a>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: '#003153', marginBottom: '20px' }}>🔌 Test de connexion</h2>
        <button 
          onClick={testConnection} 
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Test en cours...' : 'Tester la connexion'}
        </button>

        {error && (
          <div style={errorStyle}>
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {result && (
          <div style={result.success ? successStyle : errorStyle}>
            <strong>{result.message}</strong>
            {result.details && <p style={{ margin: '10px 0 0 0' }}>{result.details}</p>}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: '#003153', marginBottom: '20px' }}>📊 Explorer une table</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Nom de la table :
          </label>
          <select 
            value={tableName} 
            onChange={(e) => setTableName(e.target.value)}
            style={inputStyle}
          >
            <option value="profiles">profiles</option>
            <option value="products">products</option>
            <option value="rfqs">rfqs</option>
            <option value="messages">messages</option>
            <option value="users">users</option>
          </select>
          <button 
            onClick={fetchTableData} 
            disabled={loading}
            style={{
              ...buttonStyle,
              marginLeft: '10px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Charger les données
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Requête SQL (simulée) :
          </label>
          <input
            type="text"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            style={inputStyle}
            placeholder="SELECT * FROM profiles LIMIT 5;"
          />
          <button 
            onClick={executeSql} 
            disabled={loading}
            style={{
              ...buttonStyle,
              marginLeft: '10px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Exécuter
          </button>
        </div>

        {queryResult && (
          <div>
            <h3 style={{ color: '#003153', marginBottom: '10px' }}>
              Résultats ({queryResult.count} lignes)
              {queryResult.note && <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px', color: '#666' }}>({queryResult.note})</span>}
            </h3>
            <pre style={preStyle}>
              {JSON.stringify(queryResult.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: '#003153', marginBottom: '20px' }}>📋 Configuration</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>URL Supabase :</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configuré' : '❌ Non configuré'}
          </li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>Anon Key :</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configuré' : '❌ Non configuré'}
          </li>
          <li style={{ padding: '10px' }}>
            <strong>Client Supabase :</strong> {supabase ? '✅ Initialisé' : '❌ Non initialisé'}
          </li>
        </ul>
      </div>
    </div>
  )
}