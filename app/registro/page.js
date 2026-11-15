import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormRegistro from '../../components/FormRegistro';
import { usuarioActual } from '../../lib/sesion';

export const metadata = { title: 'Crea tu cuenta · Mati' };

export default async function Registro() {
  if (await usuarioActual()) redirect('/plantas');

  return (
    <main className="auth">
      <div className="auth-head">
        <Link href="/" className="volver" aria-label="Volver al inicio">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <h1>Crea tu cuenta</h1>
      </div>
      <p className="auth-sub">La usamos para guardar el historial de tus plantas y avisarte cuando necesiten algo.</p>
      <FormRegistro />
    </main>
  );
}
