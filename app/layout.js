import "./globals.css";
import { Poppins } from "next/font/google";

// FONT CONFIG
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Onligro - Salon Management Software",
  description: "Salon Management Software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* body me className add karo */}
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
