# Mati · Landing

Landing del proyecto **Mati**, una matera inteligente con sensores de humedad, pH y luz y una cara digital
estilo tamagotchi que muestra cómo está la planta.

Proyecto de la clase de **Emprendimiento**, Universidad Tecnológica de Pereira.

## Equipo

- Eider Alejandro Díaz Castañeda
- Miguel Ángel Arcila Gómez
- Juan Camilo Castro Montoya
- Diego Alejandro Giraldo A.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Estructura

```
app/
  layout.js      metadatos y fuentes (Bricolage Grotesque, Nunito Sans, JetBrains Mono)
  page.js        la landing completa, armada con los datos de lib/contenido.js
  registro/      crear cuenta
  ingresar/      iniciar sesión
  plantas/       la planta con su matera simulada (requiere sesión)
  acciones.js    server actions: registrar, ingresar, entrar a la demo, salir
  globals.css    estilos de la landing y las cuentas
  demo.css       estilos de la pantalla de la planta
components/
  Cara.js        las cinco expresiones de la matera en SVG
  Matera.js      la matera del hero en SVG
  MateraDemo.js  estado, riego, alertas, ajustes, historial y panel de pruebas
lib/
  contenido.js   TEXTOS Y DATOS: cambia aquí, no en los componentes
  matera.js      reglas de la matera: perfil de la planta, cara, alertas y recomendaciones
  simulador.js   matera virtual que reemplaza a la ESP32 mientras no hay hardware
test/
  matera.test.mjs  pruebas de los requerimientos funcionales (npm test)
```

## Demo de la interfaz

Mientras no hay hardware, la matera es **simulada en el navegador**. Para probarla sin registrarse:

- Botón **Probar la demo** en la landing o en `/ingresar`, o
- Correo `demo@mati.cerebria.co` y contraseña `demo1234`.

La cuenta demo tiene a **Lulú**, un potus en la sala. En `/plantas` se ve:

- **Estado:** la cara tamagotchi, la humedad, el pH, la luz y el tanque, con su rango ideal.
- **Control a distancia:** regar ahora (con "Detener"), riego automático, umbral de humedad y agua por riego.
- **Alertas y recomendaciones:** falta de agua, exceso de agua, luz insuficiente, pH fuera de rango y tanque bajo.
- **Historial** de la humedad de las últimas 24 h, con los riegos marcados.
- **Panel de pruebas:** botones que provocan cada situación y una lista de los requerimientos ya comprobados.

El reloj va acelerado: 1 segundo equivale a 10 minutos, o a 1 hora en la velocidad rápida, y se puede pausar.
Cada visitante tiene su propia simulación, guardada en su navegador, así que nadie le cambia la planta a otro.

Las reglas están en `lib/matera.js` y no dependen de la interfaz. Cuando llegue la ESP32, el firmware usa
las mismas reglas y sus lecturas reemplazan a `lib/simulador.js`.

```bash
npm test   # 24 pruebas de los requerimientos funcionales
```

Para cambiar un texto, un paso o una fila de la tabla de competencia, edita `lib/contenido.js`.

## Despliegue

El `Dockerfile` usa el build `standalone` de Next y expone el puerto **3000**.

En Coolify: crear una aplicación desde este repositorio, build pack **Dockerfile**, puerto expuesto `3000`
y el dominio deseado. La versión HTML estática anterior está desplegada en https://mati.cerebria.co

### Cuentas de la app

Los botones del llamado a la acción llevan a `/registro` e `/ingresar`, que crean la cuenta e inician
sesión. Al entrar se llega a `/plantas` (pantalla 4 de los mockups).

Las cuentas se guardan en `data/usuarios.json`, con las contraseñas cifradas con scrypt. Es un
almacenamiento de prototipo, sin base de datos. En Coolify hay que agregar un **volumen persistente**
montado en `/app/data`. Sin él, las cuentas se borran en cada despliegue.

## Notas

Los datos de la tabla de comparación salen de la matriz de competencia del proyecto
(`Matriz-Competencias/Matriz_de_competencia-plantas_completa.xlsx`).
