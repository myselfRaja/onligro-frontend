import "./globals.css";
import { Poppins } from "next/font/google";

// FONT CONFIG
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Onligro SaaS",
  description: "Salon SaaS System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* body me className add karo */}
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
