// pages/_app.js
import { AppProvider, useAppContext } from "../contexts/AppContext";
import "../styles/globals.css";

function InnerApp({ Component, pageProps }) {
  const { darkMode } = useAppContext();

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <Component {...pageProps} />
    </div>
  );
}

function MyApp(props) {
  return (
    <AppProvider>
      <InnerApp {...props} />
    </AppProvider>
  );
}

export default MyApp;
