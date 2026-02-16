import CryptoJS from 'crypto-js';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptedMessage {
  ciphertext: string;
  iv: string;
  salt?: string;
}

class EncryptionService {
  // Générer une paire de clés (simulée pour l'exemple)
  async generateKeyPair(): Promise<KeyPair> {
    const privateKey = CryptoJS.lib.WordArray.random(32).toString();
    const publicKey = CryptoJS.SHA256(privateKey).toString();
    
    return {
      publicKey,
      privateKey
    };
  }

  // Chiffrer un message avec la clé publique du destinataire
  async encryptMessage(
    message: string,
    recipientPublicKey: string,
    senderPrivateKey: string
  ): Promise<EncryptedMessage> {
    // Générer un sel aléatoire
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    
    // Dériver une clé à partir de la clé privée de l'expéditeur et du sel
    const key = CryptoJS.PBKDF2(senderPrivateKey + recipientPublicKey, salt, {
      keySize: 256 / 32,
      iterations: 1000
    });
    
    // Générer un IV aléatoire
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Chiffrer le message
    const encrypted = CryptoJS.AES.encrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return {
      ciphertext: encrypted.toString(),
      iv: iv.toString(),
      salt: salt
    };
  }

  // Déchiffrer un message
  async decryptMessage(
    encryptedMessage: EncryptedMessage,
    recipientPrivateKey: string,
    senderPublicKey: string
  ): Promise<string> {
    try {
      // Reconstruire la clé à partir de la clé privée du destinataire et du sel
      const key = CryptoJS.PBKDF2(recipientPrivateKey + senderPublicKey, encryptedMessage.salt || '', {
        keySize: 256 / 32,
        iterations: 1000
      });
      
      // Déchiffrer
      const decrypted = CryptoJS.AES.decrypt(
        encryptedMessage.ciphertext,
        key,
        {
          iv: CryptoJS.enc.Hex.parse(encryptedMessage.iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      // Convertir en UTF-8
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!result) {
        throw new Error('Échec du déchiffrement');
      }
      
      return result;
    } catch (error) {
      console.error('Erreur déchiffrement:', error);
      throw new Error('Impossible de déchiffrer le message');
    }
  }

  // Chiffrer avec un mot de passe (pour sauvegarde)
  encryptWithPassword(data: string, password: string): string {
    return CryptoJS.AES.encrypt(data, password).toString();
  }

  // Déchiffrer avec un mot de passe
  decryptWithPassword(encryptedData: string, password: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, password);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  // Générer un hash SHA-256
  hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  // Générer un HMAC
  hmac(data: string, key: string): string {
    return CryptoJS.HmacSHA256(data, key).toString();
  }
}

export const encryption = new EncryptionService();