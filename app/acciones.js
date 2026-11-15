'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  DURACION_SESION,
  cerrarSesion,
  crearUsuario,
  iniciarSesion
} from '../lib/usuarios';
import { COOKIE } from '../lib/sesion';
const correoValido = (c) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);

async function abrirSesion(token) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DURACION_SESION / 1000
  });
}

export async function registrar(_estado, form) {
  const valores = {
    nombre: String(form.get('nombre') || ''),
    correo: String(form.get('correo') || ''),
    contrasena: String(form.get('contrasena') || '')
  };
  const errores = {};
  if (valores.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre.';
  if (!correoValido(valores.correo.trim())) errores.correo = 'Revisa el correo, parece incompleto.';
  if (valores.contrasena.length < 8) errores.contrasena = 'Debe tener mínimo 8 caracteres.';
  if (!form.get('terminos')) errores.terminos = 'Necesitamos que aceptes para crear la cuenta.';

  const { contrasena, ...visibles } = valores;
  if (Object.keys(errores).length) return { errores, valores: visibles };

  const r = await crearUsuario(valores);
  if (r.error) return { errores: { correo: r.error }, valores: visibles };

  await abrirSesion(r.token);
  redirect('/plantas');
}

export async function ingresar(_estado, form) {
  const correo = String(form.get('correo') || '');
  const contrasena = String(form.get('contrasena') || '');
  if (!correo.trim() || !contrasena) {
    return { error: 'Escribe tu correo y tu contraseña.', valores: { correo } };
  }

  const r = await iniciarSesion({ correo, contrasena });
  if (r.error) return { error: r.error, valores: { correo } };

  await abrirSesion(r.token);
  redirect('/plantas');
}

export async function salir() {
  const almacen = await cookies();
  const token = almacen.get(COOKIE)?.value;
  if (token) await cerrarSesion(token);
  almacen.delete(COOKIE);
  redirect('/');
}
