import React from "react";
import { Route, Routes } from "react-router-dom";
import useNotifier from "./hooks/useNotifier";
import Home from "./pages/Home";
import "./styles/App.css";

function App() {
  useNotifier();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
