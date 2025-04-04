import React from "react"

const Container = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="w-full border-2 rounded-lg px-4 py-2 my-2 mx-3 bg-white dark:bg-neutral-600 border-neutral-200 dark:border-neutral-700 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-2 h-full overflow-y-scroll">
          <div className="p-4">
            {children}
          </div>
        </div>
        <div className="hidden md:flex md:col-span-1 md:flex-col">
          <div className="grid grid-cols-1 grid-rows-2 gap-2 h-full w-full">
            <div className="overflow-y-scroll p-2">TODO: Trending tweets</div>
            <div className="overflow-y-scroll p-2">TODO: Follow</div>
          </div>
        </div>
    </div>
  )
}

export default Container