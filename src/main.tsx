import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./lib/supabaseClient";
import { I18nextProvider } from "react-i18next";
import i18n from "./lib/i18n";

import "./globals.css";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <SessionContextProvider supabaseClient={supabase}>
          <App />
        </SessionContextProvider>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>
);
