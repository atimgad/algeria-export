'use client';

interface SecureMessageProps {
  message: string;
  showOriginal?: boolean;
}

export default function SecureMessage({ message, showOriginal = false }: SecureMessageProps) {
  
  const sanitizeMessage = (text: string): string => {
    if (showOriginal) return text;
    
    let sanitized = text;
    
    // 1. Bloque les emails
    sanitized = sanitized.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 
      '📧 [CONTACT INTERDIT]'
    );
    
    // 2. Bloque les téléphones algériens
    sanitized = sanitized.replace(
      /(?:\+213|0|00213)[5-7]\d{8}/g, 
      '📞 [NUMÉRO BLOQUÉ]'
    );
    
    // 3. Bloque les applications
    const apps = ['whatsapp', 'signal', 'telegram', 'wechat', 'viber', 'line'];
    apps.forEach(app => {
      sanitized = sanitized.replace(new RegExp(app, 'gi'), '[APPLICATION INTERDITE]');
    });
    
    // 4. Bloque les liens externes
    sanitized = sanitized.replace(
      /https?:\/\/[^\s]+/g, 
      '🔗 [LIEN SUPPRIMÉ]'
    );
    
    return sanitized;
  };

  const safeMessage = sanitizeMessage(message);

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-gray-800 whitespace-pre-wrap">
        {safeMessage}
      </div>
      {safeMessage !== message && !showOriginal && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
          ⚠️ Informations de contact masquées
        </div>
      )}
    </div>
  );
}