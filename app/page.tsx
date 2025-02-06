"use client";
import { useRouter } from 'nextjs-toploader/app';

export default function Home() {
  const router = useRouter();

  // Escaping template literals to display them as text
  const serieslinkurl = "https://vidstream.site/embed/tv/${tmdb_id}/${season_no}/${episode_no}";
  const movielinkurl = "https://vidstream.site/embed/movie/${tmdb_id}";

  return (
    <div className="text-white h-screen w-screen flex justify-center items-center bg-black px-4">
      <div className="flex flex-col items-center text-center w-full max-w-md">
        {/* Logo & Site Title */}
        <div className="flex items-center font-bold mb-5">
          <img src="/logologo.png" className="w-14 sm:w-16 mr-2" alt="Logo" />
          <p 
            onClick={() => router.push('https://vidstream.site')} 
            className="text-xl sm:text-2xl cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out font-bold text-white"
          >
            VidStream.site
          </p>
        </div>

        {/* Links Section */}
        <div className="mb-10 w-full text-base sm:text-lg font-semibold flex flex-col items-center space-y-4">
          
          {/* Movie Link */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center text-center sm:text-left">
            <p className="mr-2 text-gray-300">Movies:</p>
            <p className="break-all sm:break-normal text-blue-400 select-all bg-gray-900 p-2 rounded-md w-full sm:w-fit">
              {movielinkurl}
            </p>
          </div>

          {/* Series Link */}
          <div className="flex flex-col items-center sm:flex-row sm:items-center text-center sm:text-left">
            <p className="mr-2 text-gray-300">Series:</p>
            <p className="break-all sm:break-normal text-blue-400 select-all bg-gray-900 p-2 rounded-md w-full sm:w-fit">
              {serieslinkurl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
