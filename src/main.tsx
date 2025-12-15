
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import * as Sentry from "@sentry/react"
import ms from "ms"
import { RouterProvider } from "react-router-dom"
import router from "./routes.tsx"

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/dot-notation
const SENTRYDSN: string = import.meta.env["VITE_SENTRY_DSN"];
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/dot-notation
const VITE_API_URL: string = import.meta.env["VITE_API_URL"];

let accessRole: string | null = null;

export const setUserRole = (role: string) => {
  accessRole = role;
};
export const getUserRole = () => accessRole;

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      staleTime: ms("5 minutes"), // 5 minutes
      cacheTime: ms("30 minutes"), // 30 minutes
    },
  },
});

createRoot(document.getElementById('root')!).render(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools/>
      </QueryClientProvider>
    </ChakraProvider>
)
