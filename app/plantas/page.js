import { redirect } from 'next/navigation';
import { usuarioActual } from '../../lib/sesion';
import { salir } from '../acciones';

export const metadata = { title: 'Tus plantas · Mati' };

// Pantalla 4 de los mockups: la app recién abierta, sin materas todavía.
export default async function Plantas() {
  const usuario = await usuarioActual();
  if (!usuario) redirect('/ingresar');

  const primerNombre = usuario.nombre.split(' ')[0];

  return (
    <main className="app">
      <header className="app-head">
        <div>
          <span className="eyebrow">Hola, {primerNombre}</span>
          <h1>Tus plantas</h1>
        </div>
        <form action={salir}>
          <button className="btn btn-ghost btn-sm">Cerrar sesión</button>
        </form>
      </header>

      <section className="vacio">
        <div className="vacio-art" aria-hidden="true">
          <svg width="120" height="108" viewBox="0 0 190 170">
            <path d="M95 50 c-4 -22 8 -38 30 -44 c2 22 -10 38 -30 44z" fill="#2E8A57" />
            <path d="M95 52 c-2 -18 -14 -30 -34 -32 c0 20 12 32 34 32z" fill="#4FAE78" />
            <path d="M40 58 h110 l-14 104 h-82z" fill="#E7D9C8" />
            <rect x="34" y="50" width="122" height="16" rx="6" fill="#D9C6AF" />
            <circle cx="95" cy="108" r="30" fill="#12201A" />
            <circle cx="86" cy="106" r="2.6" fill="#BFF2D3" opacity="0.5" />
            <circle cx="95" cy="106" r="2.6" fill="#BFF2D3" opacity="0.75" />
            <circle cx="104" cy="106" r="2.6" fill="#BFF2D3" />
          </svg>
        </div>
        <h2>Todavía no tienes materas</h2>
        <p>Conecta la primera y tu planta empezará a contarte cómo se siente.</p>
        <button className="btn btn-main btn-block" disabled aria-describedby="pronto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar matera
        </button>
        <small id="pronto">El emparejamiento con la matera llega con el prototipo físico.</small>
      </section>
    </main>
  );
}
