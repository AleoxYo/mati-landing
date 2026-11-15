import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormIngreso from '../../components/FormIngreso';
import { DEMO } from '../../lib/contenido';
import { usuarioActual } from '../../lib/sesion';
import { entrarDemo } from '../acciones';

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
      <div className="demo-caja">
        <b>¿Vienes a probar la demo?</b>
        <p>
          Usa la cuenta demo, que tiene una matera simulada lista para interactuar:
        </p>
        <dl>
          <dt>Correo</dt>
          <dd>{DEMO.correo}</dd>
          <dt>Contraseña</dt>
          <dd>{DEMO.contrasena}</dd>
        </dl>
        <form action={entrarDemo}>
          <button className="btn btn-ghost btn-block">Entrar a la demo</button>
        </form>
      </div>
    </main>
  );
}
