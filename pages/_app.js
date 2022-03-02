import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import { AuthProvider } from "../context/auth";

import "../styles/globals.css";

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;
