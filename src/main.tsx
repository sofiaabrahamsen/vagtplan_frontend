import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import * as Sentry from "@sentry/react";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/dot-notation
const SENTRYDSN: string = import.meta.env["VITE_SENTRY_DSN"];
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/dot-notation
const VITE_API_URL: string = import.meta.env["VITE_API_URL"];

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
Sentry.init({
  dsn: SENTRYDSN,
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration()
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost",VITE_API_URL],
  // Enable logs to be sent to Sentry
  enableLogs: true
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
