import React from 'react'
import {  Dosis} from "next/font/google";


const dosis = Dosis({ subsets: ['latin'] })

const Body = ({children}:any) => {
  return (
    <body
    className={` ${dosis.className} antialiased`}
    suppressHydrationWarning

  >
        <link rel="icon" href="/logologo.png" sizes="any" />
    <div className=" select-none" >
    {children}
    </div>
  </body>
  )
}

export default Body