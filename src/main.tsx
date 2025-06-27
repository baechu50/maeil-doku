import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./lib/supabaseClient";

import "./globals.css";
import "./lib/i18n";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <SessionContextProvider supabaseClient={supabase}>
        <App />
      </SessionContextProvider>
    </Suspense>
  </React.StrictMode>
);
