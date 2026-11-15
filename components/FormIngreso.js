'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { ingresar } from '../app/acciones';

export default function FormIngreso() {
  const [estado, accion, enviando] = useActionState(ingresar, { valores: {} });

  return (
    <form action={accion} className="auth-form" noValidate>
      {estado.error && (
        <p className="aviso" role="alert">
          {estado.error}
        </p>
      )}

      <label className="campo">
        <span>Correo</span>
        <input
          name="correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          defaultValue={estado.valores?.correo}
          required
        />
      </label>

      <label className="campo">
        <span>Contraseña</span>
        <input name="contrasena" type="password" autoComplete="current-password" required />
      </label>

      <button className="btn btn-main btn-block" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>

      <p className="auth-alt">
        ¿No tienes cuenta? <Link href="/registro">Créala aquí</Link>
      </p>
    </form>
  );
}
