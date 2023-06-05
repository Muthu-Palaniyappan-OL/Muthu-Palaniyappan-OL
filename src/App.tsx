import { StrictMode } from "react";
import { NavBar } from "./components/NavBar.tsx";

export default function App() {
    return <StrictMode>
        <NavBar />
        <main>
            <h1>Hello World!</h1>
        </main>
    </StrictMode>
}