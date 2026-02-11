export default function TestPage() {
  return (
    <div style={{padding: '50px', textAlign: 'center'}}>
      <h1 style={{color: 'red', fontSize: '48px'}}>✅ TEST RÉUSSI !</h1>
      <p style={{fontSize: '24px'}}>Le serveur fonctionne correctement</p>
      <a href="/login" style={{fontSize: '20px', color: 'blue'}}>
        Aller à la page de login
      </a>
    </div>
  );
}