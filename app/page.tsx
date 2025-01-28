"use client"
import { useRouter } from 'nextjs-toploader/app';


export default function Home() {
  const router = useRouter();

  return (
    <div className=" h-screen w-screen flex justify-center items-center bg-black">
     <div>
        <p onClick={()=>router.push('https://letstream.site')} className=' text-xl cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out text-bold'>LetStream.site</p>
     </div>
    </div>
  );
}
