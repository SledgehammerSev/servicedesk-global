import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/hai-it-support/'
})
```

After that, your deploy command will be:
```
npm run build
npx gh-pages -d dist