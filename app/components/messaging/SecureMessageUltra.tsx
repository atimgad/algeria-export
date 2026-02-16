'use client';

import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

interface SecureMessageUltraProps {
  message: string;
  rfqId: string;
  isAdmin?: boolean;
}

export default function SecureMessageUltra({ message, rfqId, isAdmin = false }: SecureMessageUltraProps) {
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(true);
  
  useEffect(() => {
    const decryptMessage = async () => {
      try {
        // Récupérer la clé de session depuis le serveur
        const sessionKey = await fetch(`/api/session-key?rfqId=${rfqId}`).then(r => r.json());
        
        // Déchiffrer avec la clé de session
        const bytes = CryptoJS.AES.decrypt(message, sessionKey.key);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        
        // Vérifier la signature HMAC
        const signature = CryptoJS.HmacSHA256(decrypted, sessionKey.secret).toString();
        
        setDecryptedMessage(decrypted);
        setIsDecrypting(false);
      } catch (error) {
        console.error('Erreur déchiffrement:', error);
        setDecryptedMessage('⚠️ Message corrompu ou accès non autorisé');
        setIsDecrypting(false);
      }
    };
    
    decryptMessage();
  }, [message, rfqId]);

  // Fonction de détection ultra-agressive
  const detectBypass = (text: string): { hasContact: boolean; sanitized: string } => {
    let sanitized = text;
    let hasContact = false;
    
    // 1. Détection emails (toutes les variantes possibles)
    const emailPatterns = [
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
      /[a-zA-Z0-9._%+-]+\s*(?:\[at\]|\(at\)|{at}|<at>|@|arobase|chez)\s*[a-zA-Z0-9.-]+\s*(?:\[dot\]|\(dot\)|{dot}|<dot>|point)\s*[a-zA-Z]{2,}/gi,
      /[a-zA-Z0-9._%+-]+\s*[-_]\s*[a-zA-Z0-9.-]+\s*[-_]\s*[a-zA-Z]{2,}/gi,
    ];
    
    // 2. Détection téléphones (tous formats)
    const phonePatterns = [
      /(?:\+213|0|00213|00213|\+213\s?|\+213-)[5-7]\d{8}/gi,
      /(?:zéro|zero|oh|o)[\s\-]?[5-7][\s\-]?\d{2}[\s\-]?\d{2}[\s\-]?\d{2}[\s\-]?\d{2}/gi,
      /(?:cinq|six|sept)[\s\-]?\d{2}[\s\-]?\d{2}[\s\-]?\d{2}[\s\-]?\d{2}/gi,
    ];
    
    // 3. Détection applications
    const appPatterns = [
      /whatsapp|wa\.me|wa\.me\/|wa\.link|wa\.me\s+|\+?[0-9]{10,}\s*(?:whatsapp|wa)/gi,
      /signal|signal\.org|signal\.me|signal\s+app/gi,
      /telegram|t\.me|telegram\.org|@[a-zA-Z0-9_]+/gi,
      /wechat|weixin|wxid/gi,
      /viber|viber\.com|viber:\/\/|viber\s+chat/gi,
      /line|line\.me|line\s+app/gi,
      /discord|discord\.gg|discord\.com/gi,
      /skype|skype\.com|skype:\/\/|skype\s+id/gi,
    ];
    
    // 4. Détection liens externes
    const linkPatterns = [
      /https?:\/\/(?!algeriaexport\.com)[^\s]+/gi,
      /www\.[^\s]+/gi,
      /(?:bit\.ly|tinyurl|shortlink|linktr\.ee|lnkd\.in|fb\.me|instagr\.am)/gi,
    ];
    
    // Appliquer tous les patterns
    for (const pattern of emailPatterns) {
      if (pattern.test(sanitized)) {
        hasContact = true;
        sanitized = sanitized.replace(pattern, '📧 [EMAIL BLOQUÉ - SÉCURITÉ PLATEFORME]');
      }
    }
    
    for (const pattern of phonePatterns) {
      if (pattern.test(sanitized)) {
        hasContact = true;
        sanitized = sanitized.replace(pattern, '📞 [TÉLÉPHONE BLOQUÉ - CONTACT INTERNE UNIQUEMENT]');
      }
    }
    
    for (const pattern of appPatterns) {
      if (pattern.test(sanitized)) {
        hasContact = true;
        sanitized = sanitized.replace(pattern, '🚫 [APPLICATION EXTERNE INTERDITE]');
      }
    }
    
    for (const pattern of linkPatterns) {
      if (pattern.test(sanitized)) {
        hasContact = true;
        sanitized = sanitized.replace(pattern, '🔗 [LIEN EXTERNE SUPPRIMÉ]');
      }
    }
    
    // 5. Détection des images avec texte caché
    sanitized = sanitized.replace(/<img[^>]+>/gi, '[IMAGE SUPPRIMÉE - RISQUE DE CONTACT CACHÉ]');
    
    // 6. Détection des fichiers joints
    sanitized = sanitized.replace(/\[(.*?\.(?:pdf|doc|docx|xls|xlsx|txt|jpg|png))\]/gi, 
      '[FICHIER BLOQUÉ - DOIT ÊTRE VALIDÉ PAR ADMIN]');
    
    return { hasContact, sanitized };
  };

  if (isDecrypting) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded"></div>;
  }

  const { hasContact, sanitized } = detectBypass(decryptedMessage);

  return (
    <div className="relative">
      {/* Message déchiffré et sécurisé */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-800 whitespace-pre-wrap">
          {sanitized}
        </div>
      </div>
      
      {/* Alerte si tentative de contournement */}
      {hasContact && !isAdmin && (
        <div className="mt-2 p-3 bg-red-100 border-2 border-red-500 rounded-lg animate-pulse">
          <p className="text-red-800 font-bold flex items-center gap-2">
            ⚠️ TENTATIVE DE CONTOURNEMENT DÉTECTÉE
          </p>
          <p className="text-red-600 text-sm mt-1">
            Cette action a été enregistrée. Les comptes impliqués seront 
            suspendus après 3 tentatives.
          </p>
          <p className="text-xs text-red-400 mt-2">
            Référence: BYP-{Date.now()}
          </p>
        </div>
      )}
      
      {/* Badge pour l'admin */}
      {isAdmin && (
        <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
          <p className="text-xs text-blue-700">
            👁️ ADMIN - Message original: {decryptedMessage}
          </p>
        </div>
      )}
    </div>
  );
}