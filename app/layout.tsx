import type { Metadata } from "next";
import "./globals.css";
import Body from "./Body";



export const metadata: Metadata = {
  title: "VidStream",
  description: "Embed movies and series",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"     suppressHydrationWarning>
    <meta name="referrer" content="no-referrer" />
      <Body children={children}/>
    </html>
  );
}
