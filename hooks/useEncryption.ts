'use client';

import { useState, useEffect, useCallback } from 'react';
import { encryption, KeyPair, EncryptedMessage } from '@/lib/encryption';

interface UseEncryptionReturn {
  keyPair: KeyPair | null;
  isLoading: boolean;
  error: string | null;
  generateKeyPair: () => Promise<void>;
  encryptMessage: (message: string, recipientPublicKey: string) => Promise<EncryptedMessage | null>;
  decryptMessage: (encryptedMessage: EncryptedMessage, senderPublicKey: string) => Promise<string | null>;
  saveKeysToStorage: (password: string) => Promise<void>;
  loadKeysFromStorage: (password: string) => Promise<boolean>;
  clearKeys: () => void;
}

export function useEncryption(): UseEncryptionReturn {
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateKeyPair = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newKeyPair = await encryption.generateKeyPair();
      setKeyPair(newKeyPair);
      sessionStorage.setItem('temp_public_key', newKeyPair.publicKey);
    } catch (err) {
      setError('Erreur lors de la génération des clés');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const encryptMessage = useCallback(async (
    message: string,
    recipientPublicKey: string
  ): Promise<EncryptedMessage | null> => {
    if (!keyPair) {
      setError('Aucune clé disponible');
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const encrypted = await encryption.encryptMessage(
        message,
        recipientPublicKey,
        keyPair.privateKey
      );
      return encrypted;
    } catch (err) {
      setError('Erreur lors du chiffrement');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [keyPair]);

  const decryptMessage = useCallback(async (
    encryptedMessage: EncryptedMessage,
    senderPublicKey: string
  ): Promise<string | null> => {
    if (!keyPair) {
      setError('Aucune clé disponible');
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Tentative de déchiffrement...', { encryptedMessage, senderPublicKey });
      const decrypted = await encryption.decryptMessage(
        encryptedMessage,
        keyPair.privateKey,
        senderPublicKey
      );
      console.log('Déchiffrement réussi:', decrypted);
      return decrypted;
    } catch (err: any) {
      console.error('Erreur déchiffrement:', err);
      setError(err.message || 'Erreur lors du déchiffrement');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [keyPair]);

  const saveKeysToStorage = useCallback(async (password: string) => {
    if (!keyPair) {
      setError('Aucune clé à sauvegarder');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const dataToSave = JSON.stringify({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey
      });
      
      const encrypted = encryption.encryptWithPassword(dataToSave, password);
      localStorage.setItem('encrypted_keys', encrypted);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [keyPair]);

  const loadKeysFromStorage = useCallback(async (password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const encrypted = localStorage.getItem('encrypted_keys');
      if (!encrypted) {
        setError('Aucune clé trouvée');
        return false;
      }

      const decrypted = encryption.decryptWithPassword(encrypted, password);
      const keys = JSON.parse(decrypted);
      
      setKeyPair({
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
      });
      
      return true;
    } catch (err) {
      setError('Mot de passe incorrect ou données corrompues');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearKeys = useCallback(() => {
    setKeyPair(null);
    sessionStorage.removeItem('temp_public_key');
    localStorage.removeItem('encrypted_keys');
  }, []);

  return {
    keyPair,
    isLoading,
    error,
    generateKeyPair,
    encryptMessage,
    decryptMessage,
    saveKeysToStorage,
    loadKeysFromStorage,
    clearKeys
  };
}