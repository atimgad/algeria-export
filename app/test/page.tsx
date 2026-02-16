import SecureMessage from '../components/messaging/SecureMessage';

export default function TestPage() {
  const testMessages = [
    "Contactez-moi sur email@test.com",
    "Mon téléphone: 0550123456",
    "Whatsapp: +213550123456",
    "Mon site: https://contournement.com",
    "Message normal sans contact"
  ];

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test du filtre de sécurité</h1>
      {testMessages.map((msg, i) => (
        <div key={i} className="border p-4 rounded">
          <p className="text-sm text-gray-500 mb-2">Message original: {msg}</p>
          <SecureMessage message={msg} />
        </div>
      ))}
    </div>
  );
}