import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormIngreso from '../../components/FormIngreso';
import { usuarioActual } from '../../lib/sesion';

export const metadata = { title: 'Iniciar sesión · Mati' };

export default async function Ingresar() {
  if (await usuarioActual()) redirect('/plantas');

  return (
    <main className="auth">
      <div className="auth-head">
        <Link href="/" className="volver" aria-label="Volver al inicio">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </Link>
        <h1>Hola de nuevo</h1>
      </div>
      <p className="auth-sub">Entra para ver cómo están tus plantas.</p>
      <FormIngreso />
    </main>
  );
}
