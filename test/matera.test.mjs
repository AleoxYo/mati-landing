// Pruebas de los requerimientos funcionales sobre la matera virtual.
// Se corren con: npm test
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { MATERA_DEMO, PERFILES, cara, problemas } from '../lib/matera.js';
import {
  aplicarEscenario,
  avanzar,
  configurar,
  crearSimulacion,
  iniciarRiego,
  terminarRiego
} from '../lib/simulador.js';

const nueva = () => crearSimulacion(MATERA_DEMO);
const activas = (sim) => sim.alertas.filter((a) => a.activa).map((a) => a.tipo);

describe('estado de la planta', () => {
  test('arranca feliz, dentro de todos sus rangos y sin alertas', () => {
    const sim = nueva();
    assert.equal(sim.cara, 'feliz');
    assert.deepEqual(activas(sim), []);
    const { humedad, ph } = sim.estado;
    assert.ok(humedad >= 40 && humedad <= 60);
    assert.ok(ph >= 6.0 && ph <= 6.5);
  });

  test('cada medición avanza 10 minutos y guarda la humedad en el historial', () => {
    const sim = avanzar(nueva(), 6, 0);
    assert.equal(sim.estado.minuto, 60);
    assert.equal(sim.historial.length, 7);
  });

  test('la luz sigue el día: hay luz al mediodía y oscuridad de noche', () => {
    const mediodia = avanzar(nueva(), 30, 0); // 12:00
    const noche = avanzar(nueva(), 90, 0); // 22:00
    assert.ok(mediodia.estado.lux > 4000);
    assert.ok(noche.estado.lux < 20);
  });

  test('la tierra se seca sola con el paso del tiempo', () => {
    const sim = configurar(nueva(), { auto: false });
    const despues = avanzar(sim, 36, 0); // 6 h
    assert.ok(despues.estado.humedad < sim.estado.humedad);
  });
});

describe('cara tamagotchi', () => {
  const perfil = PERFILES.potus;
  const base = { humedad: 50, ph: 6.3, luzHoy: 300, luzAyer: 300, tanque: 80, minuto: 0 };
  const config = { umbral: 40, auto: true, segundos: 5 };
  const caraCon = (cambios) => cara(problemas({ ...base, ...cambios }, perfil, config));

  test('sedienta cuando la humedad baja del umbral', () => assert.equal(caraCon({ humedad: 30 }), 'sedienta'));
  test('ahogada cuando hay demasiada agua', () => assert.equal(caraCon({ humedad: 85 }), 'ahogada'));
  test('mareada cuando el pH sale del rango', () => assert.equal(caraCon({ ph: 5.2 }), 'mareada'));
  test('con sueño cuando le faltó luz', () => assert.equal(caraCon({ luzHoy: 30, luzAyer: 60 }), 'sueno'));
  test('el tanque bajo avisa pero no cambia la cara', () => assert.equal(caraCon({ tanque: 5 }), 'feliz'));
  test('si hay varios problemas, muestra el más urgente', () =>
    assert.equal(caraCon({ humedad: 30, ph: 5.2, luzHoy: 0, luzAyer: 0 }), 'sedienta'));
});

describe('control a distancia', () => {
  test('riego manual: gasta agua del tanque y sube la humedad en 15 minutos', () => {
    let sim = configurar(nueva(), { auto: false });
    const antes = sim.estado;
    sim = iniciarRiego(sim, 'manual', 0);
    assert.ok(sim.estado.regando);
    sim = terminarRiego(sim, 5000);
    assert.equal(sim.estado.regando, null);
    assert.ok(sim.estado.tanque < antes.tanque);
    sim = avanzar(sim, 2, 5000);
    assert.ok(sim.estado.humedad > antes.humedad + 15);
    assert.ok(sim.probados.includes('riego-manual'));
    assert.match(sim.alertas[0].titulo, /fue regada/);
  });

  test('detener el riego antes de tiempo echa menos agua', () => {
    const sim = configurar(nueva(), { auto: false });
    const completo = terminarRiego(iniciarRiego(sim, 'manual', 0), 5000);
    const detenido = terminarRiego(iniciarRiego(sim, 'manual', 0), 2000);
    assert.ok(detenido.estado.tanque > completo.estado.tanque);
  });

  test('riego automático: al bajar del umbral la bomba se enciende sola', () => {
    let sim = aplicarEscenario(nueva(), 'secar');
    sim = avanzar(sim, 1, 0);
    assert.equal(sim.estado.regando?.origen, 'auto');
  });

  test('con el riego automático apagado no riega y avisa que tiene sed', () => {
    let sim = configurar(nueva(), { auto: false });
    sim = avanzar(aplicarEscenario(sim, 'secar'), 3, 0);
    assert.equal(sim.estado.regando, null);
    assert.equal(sim.cara, 'sedienta');
    assert.match(sim.alertas.find((a) => a.tipo === 'sed').detalle, /apagado/);
  });

  test('cambiar el umbral cambia cuándo se considera que tiene sed', () => {
    let sim = configurar(nueva(), { auto: false });
    assert.equal(sim.cara, 'feliz'); // humedad 48 %
    sim = configurar(sim, { umbral: 55 });
    assert.equal(sim.cara, 'sedienta');
    assert.ok(sim.probados.includes('config'));
  });

  test('sin agua en el tanque no se puede regar', () => {
    let sim = aplicarEscenario(nueva(), 'vaciarTanque');
    sim = iniciarRiego(sim, 'manual', 0);
    assert.equal(sim.estado.regando, null);
  });
});

describe('alertas y recomendaciones', () => {
  test('falta de agua: alerta con el dato y la acción de regar', () => {
    const sim = aplicarEscenario(configurar(nueva(), { auto: false }), 'secar');
    const alerta = sim.alertas.find((a) => a.tipo === 'sed');
    assert.equal(alerta.accion, 'regar');
    assert.match(alerta.detalle, /mínimo 40 %/);
  });

  test('exceso de agua: alerta y la cara se ahoga', () => {
    const sim = aplicarEscenario(nueva(), 'encharcar');
    assert.ok(activas(sim).includes('exceso'));
    assert.equal(sim.cara, 'ahogada');
  });

  test('pH fuera de rango: recomienda según si el suelo está ácido', () => {
    const sim = aplicarEscenario(nueva(), 'acidificar');
    assert.match(sim.alertas.find((a) => a.tipo === 'ph').detalle, /ácido/);
  });

  test('"Ya lo corregí": el pH vuelve al rango al instante y la alerta se cierra', () => {
    const sim = aplicarEscenario(aplicarEscenario(nueva(), 'acidificar'), 'corregirPh');
    assert.ok(!activas(sim).includes('ph'));
    assert.equal(sim.cara, 'feliz');
    assert.equal(sim.alertas.find((a) => a.tipo === 'ph').activa, false);
  });

  test('el pH corregido se queda dentro del rango con el paso del tiempo', () => {
    const sim = avanzar(aplicarEscenario(aplicarEscenario(nueva(), 'acidificar'), 'corregirPh'), 40, 0);
    assert.ok(!activas(sim).includes('ph'));
  });

  test('luz insuficiente: en un rincón oscuro la planta tiene sueño', () => {
    const sim = aplicarEscenario(nueva(), 'sombra');
    assert.ok(activas(sim).includes('luz'));
    assert.equal(sim.cara, 'sueno');
    assert.match(sim.alertas.find((a) => a.tipo === 'luz').detalle, /ventana/);
  });

  test('"Ya la moví": la alerta de luz se cierra al instante y la cara vuelve a feliz', () => {
    const sim = aplicarEscenario(aplicarEscenario(nueva(), 'sombra'), 'ventana');
    assert.ok(!activas(sim).includes('luz'));
    assert.equal(sim.cara, 'feliz');
  });

  test('"Ya la moví" también funciona de noche y a las 4 p. m.', () => {
    for (const mediciones of [54, 90]) {
      const oscura = aplicarEscenario(avanzar(nueva(), mediciones, 0), 'sombra');
      assert.ok(activas(oscura).includes('luz'));
      assert.ok(!activas(aplicarEscenario(oscura, 'ventana')).includes('luz'));
    }
  });

  test('si vuelve a un rincón oscuro, la alerta de luz regresa', () => {
    const sim = aplicarEscenario(aplicarEscenario(aplicarEscenario(nueva(), 'sombra'), 'ventana'), 'sombra');
    assert.ok(activas(sim).includes('luz'));
  });

  test('tanque bajo: avisa cuántos riegos quedan', () => {
    const sim = aplicarEscenario(nueva(), 'vaciarTanque');
    assert.ok(activas(sim).includes('tanque'));
    assert.match(sim.alertas.find((a) => a.tipo === 'tanque').titulo, /vacío/);
  });

  test('una alerta no se repite mientras el problema sigue activo', () => {
    let sim = aplicarEscenario(configurar(nueva(), { auto: false }), 'secar');
    sim = avanzar(sim, 5, 0);
    assert.equal(sim.alertas.filter((a) => a.tipo === 'sed').length, 1);
  });

  test('al resolverse el problema, la alerta queda como resuelta', () => {
    let sim = aplicarEscenario(nueva(), 'vaciarTanque');
    sim = aplicarEscenario(sim, 'rellenar');
    const alerta = sim.alertas.find((a) => a.tipo === 'tanque');
    assert.equal(alerta.activa, false);
  });
});
