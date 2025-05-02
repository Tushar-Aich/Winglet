import { getUser } from "@/services/auth";
import { RootState } from "@/store/store";
import { IconBalloon } from "@tabler/icons-react";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useParams } from "react-router-dom";

type user = {
  OGName: string;
  avatar: string;
  bio: string | null;
  birthDate: string | undefined;
  comments: [];
  coverImage: string | undefined;
  email: string;
  followersCount: number;
  folloers: [];
  followings: [];
  followingCount: number;
  isFollowed: boolean;
  isPrivate: boolean;
  isVerified: boolean;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  likes: [];
  tweets: [];
  userName: string;
  _id: string;
};

const formatDate = (date: string | undefined) => {
  if(date) return date.split("T")[0]
  else return "thanks"
}

const Profile = () => {
  const [user, setUser] = useState<user | null>();
  const { userId } = useParams();
  const rootUser = useSelector((state: RootState) => state.user.user);

  const navLinks= [
    {
      name: "Tweets",
      slug: `/home/profile/${userId}/tweets`
    },
    {
      name: "Replies",
      slug: `/home/profile/${userId}/replies`
    },
    {
      name: "Likes",
      slug: `/home/profile/${userId}/likes`
    },
  ]

  useEffect(() => {
    (async () => {
      const res = await getUser(userId as string);
      console.log(res.data);
      setUser(res.data[0]);
    })();

    return () => setUser(null);
  }, [userId]);

  return (
    <div className="w-full h-full">
      <div className="relative w-full">
        {user?.coverImage ? (
          <img
            src={user.coverImage}
            className="h-40 w-full object-cover overflow-hidden"
          />
        ) : (
          <div className="h-40 w-full bg-blue-400"></div>
        )}
        <div className="absolute bottom-0 left-5 translate-y-1/2 z-20">
          <img
            src={user?.avatar}
            alt=""
            className="h-20 w-20 rounded-full object-cover border-4 border-white dark:border-black"
          />
        </div>
      </div>
      <div className="relative mt-3">
        {userId === rootUser?._id ? (
          <button className="px-4 py-1 rounded-full border-2 border-black dark:border-white absolute right-4 text-black dark:text-gray-300 cursor-pointer">
            Edit Profile
          </button>
        ) : (
          <>
            {user?.isFollowed ? (
              <button className="px-4 py-1 rounded-full border-2 border-black dark:border-white absolute right-4 text-black dark:text-gray-300 cursor-pointer">
                Following
              </button>
            ) : (
              <button className="px-4 py-1 rounded-full bg-black dark:bg-white absolute right-4 text-white dark:text-black cursor-pointer">
                Follow
              </button>
            )}
          </>
        )}
      </div>
      <p className="mt-10 font-bold text-2xl text-black dark:text-white">
        {user?.OGName}
      </p>
      <p className="text-muted-foreground text-sm">@{user?.userName}</p>
      {user?.bio ? (
        <p className="font-bold text-lg text-black dark:text-gray-200">
          {user?.bio}
        </p>
      ) : (
        <p className="font-bold text-lg text-black dark:text-gray-200">
          Please enter a bio.🥺
        </p>
      )}
      <div className="flex">
        {user?.birthDate ? (<p className="text-muted-foreground mr-2 flex items-center"> <IconBalloon size={18} /> <span className="ml-1">Born {user?.birthDate}</span></p>) : (null)}
        <p className="text-muted-foreground mr-2 flex items-center"><Calendar size="18" /> <span className="ml-1">Joined {formatDate(user?.createdAt)}</span></p>
      </div>

      <div className="flex">
        <p className="mr-2 font-bold text-lg">{user?.followersCount} <span className="text-muted-foreground">Followers</span></p>
        |
        <p className="mx-2 font-bold text-lg">{user?.followingCount} <span className="text-muted-foreground">Following</span></p>
      </div>
      <div className="flex justify-between items-center mt-4 border-b-1 border-black dark:border-white">
        {navLinks.map((link, idx) => (
          <NavLink key={idx} to={link.slug} className={({isActive}) => `w-[30%] flex justify-center text-zinc-800 dark:text-gray-300 font-bold text-md ${isActive ? "border-b-4 border-b-blue-400 text-black dark:text-white" : ""}`}>
            {link.name}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default Profile;