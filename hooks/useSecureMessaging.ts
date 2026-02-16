'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEncryption } from './useEncryption';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
}

interface SendMessageParams {
  recipientId: string;
  content: string;
}

interface UseSecureMessagingReturn {
  messages: Message[];
  conversations: any[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (params: SendMessageParams) => Promise<boolean>;
  loadMessages: (userId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
}

export function useSecureMessaging(): UseSecureMessagingReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    keyPair,
    generateKeyPair,
    encryptMessage,
    decryptMessage,
    loadKeysFromStorage,
    saveKeysToStorage
  } = useEncryption();

  // Récupérer la clé publique d'un utilisateur
  const getPublicKey = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/keys?userId=${userId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.publicKey;
    } catch (err) {
      console.error('Erreur récupération clé:', err);
      return null;
    }
  }, []);

  // Envoyer un message chiffré
  const sendMessage = useCallback(async ({ recipientId, content }: SendMessageParams): Promise<boolean> => {
    if (!keyPair) {
      setError('Vous devez générer vos clés d\'abord');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Récupérer la clé publique du destinataire
      const recipientPublicKey = await getPublicKey(recipientId);
      if (!recipientPublicKey) {
        setError('Destinataire non trouvé ou sans clé publique');
        return false;
      }

      // Chiffrer le message
      const encrypted = await encryptMessage(content, recipientPublicKey);
      if (!encrypted) {
        setError('Échec du chiffrement');
        return false;
      }

      // Envoyer le message à l'API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          encryptedContent: encrypted.ciphertext,
          iv: encrypted.iv,
          salt: encrypted.salt
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erreur envoi');
        return false;
      }

      // Recharger les messages
      await loadMessages(recipientId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [keyPair, encryptMessage, getPublicKey]);

  // Charger les messages avec un utilisateur
  const loadMessages = useCallback(async (userId: string) => {
    if (!keyPair) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erreur chargement');
        return;
      }

      const data = await response.json();
      
      // Déchiffrer chaque message
      const decryptedMessages = await Promise.all(
        data.messages.map(async (msg: any) => {
          try {
            const senderPublicKey = await getPublicKey(msg.sender_id);
            if (!senderPublicKey) return null;

            const decrypted = await decryptMessage(
              {
                ciphertext: msg.encrypted_content,
                iv: msg.iv,
                salt: msg.salt
              },
              senderPublicKey
            );

            return {
              id: msg.id,
              senderId: msg.sender_id,
              recipientId: msg.recipient_id,
              content: decrypted || '[Message corrompu]',
              createdAt: msg.created_at,
              readAt: msg.read_at
            };
          } catch (err) {
            console.error('Erreur déchiffrement message:', err);
            return null;
          }
        })
      );

      setMessages(decryptedMessages.filter(Boolean) as Message[]);
    } catch (err: any) {
      setError(err.message || 'Erreur chargement');
    } finally {
      setIsLoading(false);
    }
  }, [keyPair, decryptMessage, getPublicKey]);

  // Charger toutes les conversations
  const loadConversations = useCallback(async () => {
    if (!keyPair) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erreur chargement');
        return;
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err: any) {
      setError(err.message || 'Erreur chargement');
    } finally {
      setIsLoading(false);
    }
  }, [keyPair]);

  // Marquer un message comme lu
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, { method: 'POST' });
    } catch (err) {
      console.error('Erreur marquage lecture:', err);
    }
  }, []);

  return {
    messages,
    conversations,
    isLoading,
    error,
    sendMessage,
    loadMessages,
    loadConversations,
    markAsRead
  };
}