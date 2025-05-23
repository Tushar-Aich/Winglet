import ImageUpload from "@/components/ImageUpload"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useAvatarUpdate } from "@/Hooks/useUpdate"
import { AvatarSchema } from "@/schemas/ImageSchema"
import { RootState } from "@/store/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { QueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const UpdateAvatar = () => {
  const form = useForm<z.infer<typeof AvatarSchema>>({
      resolver: zodResolver(AvatarSchema)
  })

  const updateAvatarMutation = useAvatarUpdate()

  const rootUser = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate()

  const queryClient = new QueryClient()

  const userId = rootUser?._id!
  
  const HandleSubmit = (data: z.infer<typeof AvatarSchema>) => {
    updateAvatarMutation.mutate(data, {
      onSuccess: () => {
        toast("Avatar update successfully", {
          action: {
            label: "Go to profile",
            onClick: () => navigate(`/home/profile/${rootUser?._id}`)
          }
        })
        queryClient.invalidateQueries({ queryKey: ["user", { userId: userId }] })
        queryClient.invalidateQueries({ queryKey: ["trending"] })
        queryClient.invalidateQueries({ queryKey: ["suggested-users"] })
        queryClient.invalidateQueries({ queryKey: ["user-tweets", { userId: userId }] })
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      },
      onError: () => {
        toast("Error updating Avatar", {
          description: "Please try again."
        })
      }
    })
  }

  return (
    <div className="h-full w-full mt-10 flex flex-col justify-center items-center">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(HandleSubmit)} className="space-y-6 flex flex-col justify-center">
                <FormField 
                  control={form.control}
                  name="avatar"
                  render={({field}) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <ImageUpload 
                          value={field.value}
                          onChange={field.onChange}
                          error={form.formState.errors.avatar?.message?.toString()}
                          name="Avatar"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {updateAvatarMutation.isPending ? (
                  <Button
                    type="submit"
                    disabled
                  >
                    Submitting
                    <Loader2 className="animate-spin" />
                  </Button>
                ) : (
                  <Button className="cursor-pointer">Submit</Button>
                )}
            </form>
        </Form>
    </div>
  )
}

export default UpdateAvatar