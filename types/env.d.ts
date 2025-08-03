/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
