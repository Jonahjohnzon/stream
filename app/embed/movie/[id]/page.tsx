import React from 'react'
import Body from './Body'

const page = async ({params}:any) => {
  const param = await params
  const id = param.id
  return (
    <Body id={id}/>
  )
}

export default page