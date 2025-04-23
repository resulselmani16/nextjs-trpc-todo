import { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
