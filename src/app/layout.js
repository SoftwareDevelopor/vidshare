
// import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import MainContext from "./MainContext";
import Header from "./common/Header";


export default function RootLayout({ children }) {


  return (
    <html >
      <body
        className={` antialiased bg-black`}
      >
        <MainContext>
          <ToastContainer />
          <Header />

          {children}

        </MainContext>

      </body>
    </html>
  );
}
