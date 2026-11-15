// Lectura de la sesión desde la cookie, para las páginas del servidor.
import { cookies } from 'next/headers';
import { usuarioDeSesion } from './usuarios';

export const COOKIE = 'mati_sesion';

export async function usuarioActual() {
  const token = (await cookies()).get(COOKIE)?.value;
  return usuarioDeSesion(token);
}
