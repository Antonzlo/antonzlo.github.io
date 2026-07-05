import React from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./order-form.css";
import App from "./App";

const container = document.getElementById("root");
createRoot(container).render(<App />);
