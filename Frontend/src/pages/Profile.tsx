import { getUser } from "@/services/auth";
import { IconBalloon } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";

const Profile = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return (
      <p>
        Error :: {error.name}, {error.message}
      </p>
    );
  
    const formatDate = (createdAt: string) => {
      const formattedDate = createdAt.split('T')[0]
      console.log(formattedDate)
      return formattedDate
    }
  return (
    <div className="w-full h-full">
      <div className="relative w-full">
        {data.coverImage ? (
          <img
            src={data.coverImage}
            className="h-40 w-full object-cover object-center overflow-hidden"
          />
        ) : (
          <div className="h-40 w-full bg-blue-400"></div>
        )}
        <div className="absolute bottom-0 left-5 translate-y-1/2 z-20">
          <img
            src={data.avatar}
            alt=""
            className="h-20 w-20 rounded-full border-4 border-white dark:border-neutral-600"
          />
        </div>
      </div>
      <div className="relative mt-3">
        <button className="px-4 py-1 rounded-full border-2 border-black dark:border-white absolute right-4 text-black dark:text-gray-300 cursor-pointer">
          Edit Profile
        </button>
      </div>
      <p className="mt-10 font-bold text-2xl text-black dark:text-white">
        {data.OGName}
      </p>
      <p className="text-muted-foreground text-sm">@{data.userName}</p>
      {data.bio ? (
        <p className="font-bold text-lg text-black dark:text-gray-200">
          {data.bio}
        </p>
      ) : (
        <p className="font-bold text-lg text-black dark:text-gray-200">
          Please enter a bio.🥺
        </p>
      )}

      <div className="flex">
        {data.birthDate ? (<p className="text-muted-foreground mr-2 flex items-center"> <IconBalloon size={18} /> <span className="ml-1">Born {data.birthDate}</span></p>) : (null)}
        <p className="text-muted-foreground mr-2 flex items-center"><Calendar size="18" /> <span className="ml-1">Joined {formatDate(data.createdAt)}</span></p>
      </div>

      <div className="flex">
        <p className="mr-2 font-bold text-lg">{data.followers.length} <span className="text-muted-foreground">Followers</span></p>
        |
        <p className="mx-2 font-bold text-lg">{data.following.length} <span className="text-muted-foreground">Following</span></p>
      </div>
    </div>
  );
};

export default Profile;
