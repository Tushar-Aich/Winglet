import ImageUpload from "@/components/ImageUpload"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useCoverImage } from "@/Hooks/useUpdate"
import { CoverImageSchema } from "@/schemas/ImageSchema"
import { RootState } from "@/store/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { QueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const UpdateCoverImage = () => {
  const form = useForm<z.infer<typeof CoverImageSchema>>({
      resolver: zodResolver(CoverImageSchema)
  })

  const updateCoverImageMutation = useCoverImage()

  const rootUser = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate()

  const queryClient = new QueryClient()

  const userId = rootUser?._id!
  
  const HandleSubmit = (data: z.infer<typeof CoverImageSchema>) => {
    console.log(data)
    updateCoverImageMutation.mutate(data, {
      onSuccess: () => {
        toast("Cover Image update successfully", {
          action: {
            label: "Go to profile",
            onClick: () => navigate(`/home/profile/${rootUser?._id}`)
          }
        })
        queryClient.invalidateQueries({ queryKey: ["user", { userId: userId }] })
      },
      onError: () => {
        toast("Error updating Cover Image", {
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
                  name="coverImage"
                  render={({field}) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <ImageUpload 
                          value={field.value}
                          onChange={field.onChange}
                          error={form.formState.errors.coverImage?.message?.toString()}
                          name="Cover Image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {updateCoverImageMutation.isPending ? (
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

export default UpdateCoverImage