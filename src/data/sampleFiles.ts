import indexV1 from '../../docs/examples/activo-digital-blog/index-v1.html?raw'
import indexV2 from '../../docs/examples/activo-digital-blog/index-v2.html?raw'
import indexV3 from '../../docs/examples/activo-digital-blog/index-v3.html?raw'
import indexV4 from '../../docs/examples/activo-digital-blog/index-v4.html?raw'
import indexFinal from '../../docs/examples/activo-digital-blog/index-final.html?raw'

export const SAMPLE_FILES: Record<string, { label: string; fileName: string; html: string }> = {
  v1: {
    label: 'Ejemplo oficial · Paso 1 (estructura)',
    fileName: 'index-v1.html',
    html: indexV1,
  },
  v2: {
    label: 'Ejemplo oficial · Paso 2 (on-page)',
    fileName: 'index-v2.html',
    html: indexV2,
  },
  v3: {
    label: 'Ejemplo oficial · Paso 3 (accesibilidad)',
    fileName: 'index-v3.html',
    html: indexV3,
  },
  v4: {
    label: 'Ejemplo oficial · Paso 4 (Schema)',
    fileName: 'index-v4.html',
    html: indexV4,
  },
  final: {
    label: 'Ejemplo oficial · Paso 5 (auditoría)',
    fileName: 'index-final.html',
    html: indexFinal,
  },
  bad: {
    label: 'Ejemplo con errores (prueba negativa)',
    fileName: 'sample-bad.html',
    html: `<html><body><div><p>TODO: completar</p><img src="x.png"><a href="#">clic aquí</a></div></body></html>`,
  },
}
