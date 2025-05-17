import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateBio } from "@/Hooks/useUpdate"
import { BioSchema } from "@/schemas/BioSchema"
import { RootState } from "@/store/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { QueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const updateBio = () => {
  const [text, setText] = useState<string>("")

  const {register, handleSubmit, formState: { errors }} = useForm<z.infer<typeof BioSchema>>({
    resolver: zodResolver(BioSchema)
  })

  const updateBioMutation = useUpdateBio()

  const navigate = useNavigate()

  const rootUser = useSelector((state: RootState) => state.user.user)

  const userId = rootUser?._id

  const queryClient = new QueryClient()

  const HandleSubmit = async (data: z.infer<typeof BioSchema>) => {
    const { bio } = data
    updateBioMutation.mutate(bio, {
      onSuccess: () => {
        toast("Bio update successfully", {
          action: {
            label: "Go to profile",
            onClick: () => navigate(`/home/profile/${rootUser?._id}`)
          }
        })
        queryClient.invalidateQueries({ queryKey: ["user", { userId: userId }] })
        setText("")
      },
      onError: () => {
        toast("Error updating Bio", {
          description: "Please try again."
        })
      }
    })
  }

  return (
    <div className="h-full w-screen mt-10 flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit(HandleSubmit)} className="space-y-6 flex flex-col justify-center">
          <Textarea
            {...register("bio")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us about yourself..."
            className="h-32 w-80 sm:w-[500px] resize-none text-lg md:text-xl font-bold"
          />
          {errors.bio && <p className="text-red-500 font-bold text-sm md:text-lg">{errors.bio.message}</p>}

          <div className="flex justify-between items-center gap-4 mr-2">
            {text.length > 200 ? (
              <div>
                <h1 className="text-red-500 font-bold text-xl">
                  {text.length}
                </h1>
                <p className="text-red-500 font-bold text-sm md:text-lg">
                  Can't post more than 200 characters
                </p>
              </div>
            ) : (
              <h1 className=" font-bold text-xl">{text.length}</h1>
            )}
            {updateBioMutation.isPending ? (
              <Button
                type="submit"
                className="font-bold text-lg px-6 py-4"
                disabled
              >
                Adding Bio
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="font-bold text-lg px-6 py-4 cursor-pointer"
              >
                Add Bio
              </Button>
            )}
          </div>
        </form>
    </div>
  )
}

export default updateBio