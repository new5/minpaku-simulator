import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Rechartsなどのライブラリが依存するパッケージ（d3-scale等）の
    // 読み込みエラーを回避するために、優先するフィールドを明示します
    mainFields: ['module', 'main', 'jsnext:main', 'jsnext'],
  },
})