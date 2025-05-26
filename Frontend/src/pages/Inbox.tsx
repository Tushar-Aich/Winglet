import { useGetUsersForSideBar } from "@/Hooks/useQueries"
import { useNavigate } from "react-router-dom"

const Inbox = () => {
  const getUsers = useGetUsersForSideBar()
  const data = getUsers?.data
  const navigate = useNavigate()

  console.log(data)

  return (
    <>
    <div>
      <div className="h-full w-full">
        {data?.map((data, idx) => (
          <div key={idx} className="border-b-2 border-muted-foreground px-2 py-4 my-5 flex items-center justify-between cursor-pointer" onClick={() => navigate(`/home/inbox/${data._id}`)}>
            <div className="flex items-start gap-4">
              <img src={data.avatar} alt="DP" className="h-12 w-12 rounded-full"/>
              <div className="font-bold text-lg">{data.name}</div>
            </div>
            <div>
              {data.unreadCount > 0 && <div className="mr-4 bg-green-500 shadow-lg shadow-green-500/30 text-black h-5 w-5 rounded-full flex items-center justify-center text-xs p-2">
                {data.unreadCount}
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>

    {getUsers.isFetching && <div>Loading...</div>}
    </>
  )
}

export default Inbox