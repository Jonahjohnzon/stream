import React from 'react'
import Body from './Body'

const page = async ({params}:any) => {
  const param = await params
  const id = param.id
  const season = param.season
  const  episode = param.episode
  return (
    <Body id={id} season={season} episode={episode}/>
  )
}

export default page