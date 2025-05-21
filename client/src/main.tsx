import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  App  from './App.tsx'

//as は型アサーション。型推論を上書きしてElement型を明示的に割り当てている。
const root = createRoot(document.getElementById("root") as Element);

root.render(
  <StrictMode>
      <App />
  </StrictMode>
  
);
