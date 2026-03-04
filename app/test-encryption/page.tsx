'use client';

import { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';

export default function TestEncryptionPage() {
  const {
    keyPair,
    isLoading,
    error,
    generateKeyPair,
    encryptMessage,
    decryptMessage,
    saveKeysToStorage,
    loadKeysFromStorage,
    clearKeys
  } = useEncryption();

  const [message, setMessage] = useState('');
  const [recipientKey, setRecipientKey] = useState('');
  const [encryptedResult, setEncryptedResult] = useState<any>(null);
  const [decryptedResult, setDecryptedResult] = useState('');
  const [senderKeyForDecrypt, setSenderKeyForDecrypt] = useState('');
  const [password, setPassword] = useState('');
  const [loadPassword, setLoadPassword] = useState('');

  const handleEncrypt = async () => {
    if (!message || !recipientKey) return;
    const encrypted = await encryptMessage(message, recipientKey);
    setEncryptedResult(encrypted);
    setDecryptedResult('');
    if (encrypted) {
      setSenderKeyForDecrypt(keyPair?.publicKey || '');
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedResult || !senderKeyForDecrypt) return;
    const decrypted = await decryptMessage(encryptedResult, senderKeyForDecrypt);
    setDecryptedResult(decrypted || '');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#003153] mb-8">
          🔐 Test Chiffrement de bout en bout
        </h1>

        {/* Génération de clés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-[#003153] mb-4">1. Générer vos clés</h2>
          
          {!keyPair ? (
            <button
              onClick={generateKeyPair}
              disabled={isLoading}
              className="px-4 py-2 bg-[#003153] text-white rounded-lg hover:bg-[#002244] disabled:opacity-50"
            >
              {isLoading ? 'Génération...' : 'Générer une paire de clés'}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Clé publique :</span>
                <br />
                <code className="text-xs bg-gray-100 p-1 rounded break-all">
                  {keyPair.publicKey}
                </code>
              </p>
              <p className="text-sm">
                <span className="font-medium">Clé privée :</span>
                <br />
                <code className="text-xs bg-gray-100 p-1 rounded break-all">
                  {keyPair.privateKey.substring(0, 50)}...
                </code>
              </p>
            </div>
          )}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Sauvegarde sécurisée */}
        {keyPair && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-[#003153] mb-4">2. Sauvegarder vos clés</h2>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe de chiffrement"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              />
              <button
                onClick={() => saveKeysToStorage(password)}
                disabled={isLoading || !password}
                className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1e5f22] disabled:opacity-50"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        {/* Chargement des clés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-[#003153] mb-4">3. Charger vos clés</h2>
          <div className="flex gap-2">
            <input
              type="password"
              value={loadPassword}
              onChange={(e) => setLoadPassword(e.target.value)}
              placeholder="Mot de passe"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
            />
            <button
              onClick={async () => {
                const success = await loadKeysFromStorage(loadPassword);
                if (success) alert('Clés chargées avec succès !');
              }}
              disabled={isLoading || !loadPassword}
              className="px-4 py-2 bg-[#003153] text-white rounded-lg hover:bg-[#002244] disabled:opacity-50"
            >
              Charger
            </button>
            {keyPair && (
              <button
                onClick={clearKeys}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Test de chiffrement */}
        {keyPair && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-[#003153] mb-4">4. Tester le chiffrement</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message à chiffrer
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Votre message secret..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clé publique du destinataire
                </label>
                <textarea
                  value={recipientKey}
                  onChange={(e) => setRecipientKey(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                  placeholder="Collez la clé publique ici..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleEncrypt}
                  disabled={isLoading || !message || !recipientKey}
                  className="px-4 py-2 bg-[#003153] text-white rounded-lg hover:bg-[#002244] disabled:opacity-50"
                >
                  Chiffrer
                </button>
                {encryptedResult && (
                  <button
                    onClick={handleDecrypt}
                    disabled={isLoading}
                    className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1e5f22] disabled:opacity-50"
                  >
                    Déchiffrer
                  </button>
                )}
              </div>

              {encryptedResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-[#003153] mb-2">Message chiffré :</p>
                  <p className="text-xs break-all bg-white p-2 rounded border">
                    {encryptedResult.ciphertext}
                  </p>
                  <p className="font-medium text-[#003153] mt-2 mb-1">IV (nonce) :</p>
                  <p className="text-xs break-all bg-white p-2 rounded border">
                    {encryptedResult.iv}
                  </p>
                  {encryptedResult.salt && (
                    <>
                      <p className="font-medium text-[#003153] mt-2 mb-1">Sel :</p>
                      <p className="text-xs break-all bg-white p-2 rounded border">
                        {encryptedResult.salt}
                      </p>
                    </>
                  )}
                </div>
              )}

              {decryptedResult && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-[#2E7D32] mb-2">Message déchiffré :</p>
                  <p className="text-sm">{decryptedResult}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}