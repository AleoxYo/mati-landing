'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { registrar } from '../app/acciones';

export default function FormRegistro() {
  const [estado, accion, enviando] = useActionState(registrar, { errores: {}, valores: {} });
  const [ver, setVer] = useState(false);
  const e = estado.errores || {};
  const v = estado.valores || {};

  return (
    <form action={accion} className="auth-form" noValidate>
      <label className="campo">
        <span>Nombre</span>
        <input name="nombre" autoComplete="name" defaultValue={v.nombre} aria-invalid={!!e.nombre} required />
        {e.nombre && <small className="error">{e.nombre}</small>}
      </label>

      <label className="campo">
        <span>Correo</span>
        <input
          name="correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          defaultValue={v.correo}
          aria-invalid={!!e.correo}
          required
        />
        {e.correo && <small className="error">{e.correo}</small>}
      </label>

      <label className="campo">
        <span>Contraseña</span>
        <div className="con-boton">
          <input
            name="contrasena"
            type={ver ? 'text' : 'password'}
            autoComplete="new-password"
            minLength={8}
            aria-invalid={!!e.contrasena}
            required
          />
          <button type="button" onClick={() => setVer(!ver)} aria-pressed={ver}>
            {ver ? 'Ocultar' : 'Ver'}
          </button>
        </div>
        {e.contrasena ? <small className="error">{e.contrasena}</small> : <small>Mínimo 8 caracteres</small>}
      </label>

      <label className="check">
        <input type="checkbox" name="terminos" />
        <span>Acepto los términos y el tratamiento de mis datos.</span>
      </label>
      {e.terminos && <small className="error">{e.terminos}</small>}

      <button className="btn btn-main btn-block" disabled={enviando}>
        {enviando ? 'Creando tu cuenta…' : 'Crear cuenta'}
      </button>

      <p className="auth-alt">
        ¿Ya tienes cuenta? <Link href="/ingresar">Inicia sesión</Link>
      </p>
    </form>
  );
}
