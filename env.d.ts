/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // 更多環境變數...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
