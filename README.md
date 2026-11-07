# UProc Zapier Integration

> Integración oficial de uProc con [Zapier](https://zapier.com/) que permite ejecutar tools de data process de uProc desde Zapier.

---

## Descripción

Esta integración permite a los usuarios de Zapier conectar su cuenta de uProc y ejecutar las tools de data process de uProc directamente desde Zapier:

- **Select Tool** (Create) → Ejecutar cualquier tool de data process (validación email, enriquecimiento, etc.)
- **B2B Lists** (Trigger webhook) → Trigger cuando se añade un perfil a una lista B2B de uProc
- **Web Lists** (Trigger webhook) → Trigger cuando se añade un webtrack a una lista de webtracking

## Estructura del proyecto

```
uproc-zapier/
├── index.js                  # Entry point (exporta la App con autenticación + triggers + creates)
├── zapierwrapper.js          # Wrapper para Zapier CLI (build step)
├── package.json              # Dependencias (zapier-platform-core, zapier-platform-cli)
├── package-lock.json
├── CHANGELOG.md              # Historial de versiones
├── README.md                 # Este archivo
├── .gitignore                # Archivos a ignorar
├── .zapierapprc              # ID de app en Zapier Platform CLI
├── definition.json           # Definición compilada (generada por Zapier CLI build)
├── definition.json.new       # Definición anterior (backup)
├── creates/
│   └── tools.js              # Create: "Select Tool" - ejecuta tools de data process
└── triggers/
    ├── b_2_b_lists.js        # Trigger webhook: New Profile Added to B2B List
    ├── data_processed_trigger.js  # Trigger webhook: Data Processed (comentado)
    └── web_lists.js          # Trigger webhook: New Webtrack Added to Web List
```

## Módulos

### Create: Select Tool (`creates/tools.js`)

Permite ejecutar cualquier tool de data process de uProc desde Zapier.

**Flujo:**
1. Seleccionar grupo de tools (validation, enrichment, etc.)
2. Seleccionar tool específica del grupo
3. Introducir parámetros dinámicos de la tool
4. Ejecutar la tool y recibir resultado

**Ejemplo:**
```
Zap: New Form Submission → UProc: Select Tool (check-email-exists) → Send Email
```

### Trigger: B2B Lists (`triggers/b_2_b_lists.js`)

Se dispara cuando se añade un nuevo perfil a una lista B2B de uProc.

**Tipo:** Webhook (hook)

**Datos del trigger:**
- Datos del perfil (person)
- Datos de la empresa (company_general, company_contact, company_financial, company_social, company_technologies)

**Nota:** Contiene sample data con datos de ejemplo (incluye datos del desarrollador como referencia).

### Trigger: Web Lists (`triggers/web_lists.js`)

Se dispara cuando se añade una nueva visita a una lista de webtracking de uProc.

**Tipo:** Webhook (hook)

**Datos del trigger:**
- Datos de la visita (IP, user-agent, página, sitio)
- Datos geográficos (país, ciudad, coordenadas, zipcode)
- Datos de red (hostname, provider, IP range)
- Datos de reputación (proxy, TOR, blacklist)
- Datos de la empresa asociada

### Trigger: Data Processed (comentado) (`triggers/data_processed_trigger.js`)

Este trigger está comentado en el `index.js`. Está disponible para descomentar si se necesita.

**Estado:** Desactivado (comentado en `index.js` línea 57)

## Autenticación

La integración usa **Basic Auth** con email + API key.

### Credenciales necesarias:
- **Email**: Tu email de uProc (campo `username` en Zapier)
- **API Key**: Tu API key real (campo `api_key` en Zapier)

### Cómo obtener las credenciales:
1. Inicia sesión en [app.uproc.io](https://app.uproc.io)
2. Ve a **Settings → Integrations**
3. En la sección **API Credentials**:
   - **Username** → Tu email
   - **API Key (real)** → Tu API key

## Desarrollo local

### Instalar dependencias
```bash
npm install
```

### Test local
```bash
npm test
```

### Build para Zapier
```bash
npx zapier build
```

### Push a Zapier
```bash
npx zapier push
```

### Ver logs de Zapier
```bash
npx zapier logs
```

## Archivos generados

### `definition.json`

Este archivo es generado automáticamente por `zapier build`. Contiene:
- La definición compilada de la app
- Funciones inline (reemplazadas por `$func$...`)
- Sample data embebida (incluye datos PII si los samples los tienen)

**Importante:** No editar manualmente. Generar siempre con `zapier build`.

### `.zapierapprc`

Archivo de configuración de Zapier Platform CLI:
```json
{
  "id": 4807,
  "key": "App4807"
}
```

Contiene el ID de la app en la plataforma Zapier. No compartir públicamente.

## Limitaciones

- Solo soporta **tools de data process** (no los módulos de la plataforma)
- Los triggers webhook requieren que Zapier tenga un endpoint público accesible
- `data_processed_trigger` está actualmente comentado

## Versionado

- `CHANGELOG.md`: Historial de cambios
- `definition.json`: Versión compilada actual (v1.0.3)
- `definition.json.new`: Backup de versión anterior (v1.0.0)

## Licencia

BSD-3-Clause

## Autor

**Miquel Colomer** — [miquel@uproc.io](mailto:miquel@uproc.io)

---

> Esta integración se construye con [Zapier Platform CLI](https://platform.zapier.com/reference/cli).
> Para más información sobre cómo crear integraciones para Zapier, consulta la [documentación oficial](https://platform.zapier.com/).