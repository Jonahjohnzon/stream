import React from 'react'
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });
const Body = ({children}:any) => {
  return (
    <body
    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    suppressHydrationWarning

  >
    <div className=" select-none" >
    {children}
    </div>
  </body>
  )
}

export default Body