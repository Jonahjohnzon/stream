export const getSub =async(subtitle:any)=>{
    try{
      const file = subtitle[0]?.url
      const fileResponse = await fetch(file);
      let subtitleText = await fileResponse.text();
      const blob = new Blob([subtitleText], { type: "text/srt" });
      const subUrl = URL.createObjectURL(blob);
      const subData = {...subtitle[0], subUrl}
      return subData
    
    }
    catch(err)
    {
      console.log(err)
    }
    }