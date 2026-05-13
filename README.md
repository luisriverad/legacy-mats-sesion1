# Profit120 — Diagnóstico del Negocio Familiar

Aplicación de sesión estratégica para diagnóstico de negocios familiares. 6 módulos integrados en un solo documento con pestañas accionables y cierre estratégico.

## Stack

- **Vite** + **React 18** + **TypeScript**
- Sin frameworks de UI externos (todo es CSS-in-JS inline)
- Persistencia en `localStorage` (clave: `profit120_sesion_diagnostico_v1`)
- Inter como tipografía

## Cómo correr

```bash
npm install
npm run dev
```

Se abre automáticamente en `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura

```
src/
├── App.tsx                        # Componente raíz, conecta tabs + módulos
├── main.tsx                       # Entry point React
├── index.css                      # Estilos globales y variables P120
├── types.ts                       # Tipos compartidos
├── constants.ts                   # Colores, defaults, helpers
├── hooks/
│   └── useSessionState.ts         # Hook con localStorage + reset
└── components/
    ├── Header.tsx                 # Título + botones globales
    ├── Tabs.tsx                   # Barra de navegación de 6 pestañas
    ├── Shared.tsx                 # PaneTitle, NextButton, TriState, etc.
    └── modules/
        ├── MapaModule.tsx         # 01 Mapa del Negocio Familiar
        ├── MatrizModule.tsx       # 02 Matriz de Valor Real
        ├── RentabilidadModule.tsx # 03 Mapa de Rentabilidad
        ├── IcebergModule.tsx      # 04 Iceberg del Negocio Familiar
        ├── FiltroModule.tsx       # 05 Filtro de Criterio Empresarial
        └── CierreModule.tsx       # ✦ Cierre Estratégico
```

## Branding Profit120

Sistema de diseño:

- **Negro**: `#1F2225`
- **Verde**: `#71B248`
- **Verde claro**: `#a8d088`
- **Ámbar**: `#C8A85A` (solo para "Renegociar")
- **Blanco**: `#FFFFFF`
- **Tipografía**: Inter
- **Footer**: `www.profit120.com · info@profit120.com`

## Funcionalidades clave

- **6 pestañas** con navegación instantánea (sin recargar)
- **Indicador de progreso** por pestaña (puntito verde cuando hay contenido)
- **Botón "Siguiente módulo →"** al final de cada pestaña
- **Autoguardado** en localStorage en cada cambio
- **Snapshot dinámico** en la pestaña Cierre que lee las 5 pestañas
- **Imprimir / PDF** despliega todas las pestañas
- **Limpiar todo** reinicia la sesión completa

## Para Cursor

Cada módulo es un archivo separado y aislado. Para editar el contenido o estilo de un módulo, ve directamente al archivo correspondiente en `src/components/modules/`. Los controles compartidos (selectores tri-state, veredicto, etc.) están en `src/components/Shared.tsx`. Los textos por defecto y umbrales están en `src/constants.ts`.
