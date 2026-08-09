import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-right" />
            <AppRoutes />
        </>
    );
}

export default App;
