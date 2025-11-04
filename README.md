# CoFi — Administración Financiera Colaborativa para Estudiantes (TECSUP)

Estado: En desarrollo

Descripción general
-------------------
CoFi es una aplicación web (con extensión móvil prevista) diseñada para facilitar la administración financiera colaborativa entre estudiantes del Instituto de Educación Superior Tecnológico TECSUP. La plataforma ayuda a registrar ingresos y egresos, coordinar presupuestos compartidos entre equipos de trabajo o compañeros de vivienda, generar reportes en tiempo real y ofrecer recomendaciones personalizadas mediante IA. Además contempla funcionalidades experimentales como registro de operaciones por voz.

Problema que resuelve
---------------------
Muchos estudiantes enfrentan dificultades para llevar un control de gastos compartidos (proyectos, movilidad, alimentación, materiales) y para planificar su economía durante la etapa académica. CoFi busca:
- Mejorar la visibilidad de los flujos de dinero individuales y grupales.
- Facilitar la coordinación financiera en actividades y proyectos.
- Fomentar hábitos responsables de ahorro y planificación.

Características principales
---------------------------
- Registro de transacciones: ingresos y egresos, con categorización y etiquetas.
- Cuentas y fondos compartidos: crear presupuestos grupales y dividir gastos.
- Presupuestos y alertas: notificaciones cuando se acercan o se exceden límites.
- Reportes e indicadores: dashboards con gastos por categoría, tendencia mensual y balances.
- Recomendaciones por IA: sugerencias de ahorro y optimización con base en patrones de gasto.
- Comandos de voz (experimental): registrar transacciones usando voz (Web Speech API u otra integración).
- Roles y permisos: control de acceso para miembros de un presupuesto compartido.
- Panel web: desarrollado con Next.js; API y acceso a datos gestionados con Prisma.

Cómo funciona (visión general)
------------------------------
1. Usuarios crean una cuenta y pueden iniciar o unirse a “espacios” (grupos/proyectos) para compartir presupuestos.
2. Cada miembro registra ingresos y gastos, asignando categorías y miembros responsables.
3. La app consolida los movimientos para mostrar balances individuales y del grupo, generar reportes y emitir alertas.
4. Un módulo de IA (con servicio externo) analiza los patrones de gasto y propone recomendaciones personalizadas.
5. Opcionalmente, los usuarios pueden dictar transacciones por voz para un registro rápido.

Arquitectura y tecnologías
--------------------------
- Frontend: Next.js + React + TypeScript
- Backend / ORM: Node.js + Prisma (compatible con PostgreSQL en producción; SQLite para desarrollo)
- Autenticación: (por definir; sugerencias: NextAuth o JWT)
- IA / Recomendaciones: integración con APIs de modelos (ej. OpenAI u otro proveedor)
- Voz: Web Speech API o servicios externos de reconocimiento
- Despliegue sugerido: Vercel (frontend), proveedor gestionado de PostgreSQL para producción

Estructura del repositorio (resumen)
------------------------------------
- /prisma — esquema y migraciones de la base de datos
- /public — recursos estáticos (imágenes, logos, etc.)
- /src — código fuente (frontend y/o API)
- README.md, next.config.ts, package.json, tsconfig.json — configuración general

Requisitos previos
------------------
- Node.js >= 18
- npm, yarn o pnpm
- Base de datos para producción (Postgres recomendado)
- Claves/secretos para servicios externos (OPENAI_API_KEY, etc.)

Instalación y ejecución (desarrollo)
-----------------------------------
1. Clona el repositorio:
   git clone https://github.com/ErickGC546/C24_6_2025-2_G15_CoFi_B.git
2. Entra al directorio:
   cd C24_6_2025-2_G15_CoFi_B
3. Instala dependencias:
   npm install
   # o
   yarn
   # o
   pnpm install
4. Copia y edita variables de entorno:
   cp .env.example .env
   - DATABASE_URL="postgresql://user:password@localhost:5432/cofi"
   - NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   - NEXTAUTH_URL="http://localhost:3000"
   - OPENAI_API_KEY="tu_api_key_si_aplica"
5. Ejecuta migraciones de Prisma (si aplica):
   npx prisma migrate dev --name init
6. Inicia el servidor de desarrollo:
   npm run dev
7. Abre http://localhost:3000

Comandos útiles
---------------
- npm run dev — iniciar entorno de desarrollo
- npm run build — compilar para producción
- npm run start — ejecutar versión de producción
- npx prisma migrate dev — aplicar migraciones
- npx prisma studio — explorar la base de datos mediante GUI

Despliegue
----------
- Recomendado: Vercel para el frontend Next.js.
- Configura las variables de entorno (DATABASE_URL, OPENAI_API_KEY, NEXTAUTH_URL, etc.) en la plataforma de despliegue.
- Usa un servicio gestionado de PostgreSQL en producción y asegura backups.

Buenas prácticas y seguridad
----------------------------
- No subir archivos .env ni credenciales al repositorio.
- Validar y sanitizar todas las entradas en el backend.
- Implementar autenticación y autorización robusta para datos compartidos.
- Revisar vulnerabilidades en dependencias (npm audit) y mantener actualizaciones periódicas.
- Solicitar y registrar consentimientos al usar funcionalidades de voz o análisis con IA.

Trabajo en equipo y responsabilidades (sugerencia)
--------------------------------------------------
- Frontend: interfaces, componentes, accesibilidad y PWA si aplica.
- Backend: modelos, controladores, autenticación y lógica de negocios.
- Data/DB: diseño de esquema (Prisma), migraciones y seeds.
- IA: integración de APIs y validación de recomendaciones.
- QA: pruebas funcionales y revisión de seguridad.

Cómo contribuir
---------------
1. Abre un issue describiendo bug o feature.
2. Crea una rama con prefijo feature/ o fix/.
3. Añade tests y documentación.
4. Abre un Pull Request describiendo:
   - Qué problema resuelve
   - Cómo probarlo localmente
   - Notas importantes para el revisor

Roadmap / mejoras previstas
---------------------------
- Versión móvil (React Native / Expo) o PWA mejorada.
- Recomendaciones más avanzadas con embeddings y métricas personalizadas.
- Exportación/backup de datos (CSV / PDF).
- Integración opcional con pasarelas de pago y conciliación automática.
- Mecanismo de auditoría y logs para transacciones compartidas.

Licencia
--------
- Añade un archivo LICENSE (por ejemplo MIT) si quieres permitir uso y contribuciones públicas.

Contacto
--------
- Autor / Mantenedor: ErickGC546  
- Sitio (despliegue): https://co-fi-web.vercel.app  
- Repositorio: https://github.com/ErickGC546/C24_6_2025-2_G15_CoFi_B

Referencias visuales
--------------------
- Captura de la estructura del repositorio y panel (referencia: imagen 1).

¿Quieres que haga ahora alguno de estos cambios directamente en tu repositorio?
- Puedo generar y añadir un archivo .env.example.
- Puedo añadir badges (build, deploy, license) al inicio del README.
- Puedo crear plantillas en .github/ISSUE_TEMPLATE y .github/PULL_REQUEST_TEMPLATE.
Indica cuál prefieres y lo agrego al README o creo los archivos necesarios.
