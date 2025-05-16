import ImageUpload from "@/components/ImageUpload"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { AvatarSchema } from "@/schemas/avatarSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const UpdateAvatar = () => {
    const form = useForm<z.infer<typeof AvatarSchema>>({
        resolver: zodResolver(AvatarSchema)
    })

    const HandleSubmit = (data: z.infer<typeof AvatarSchema>) => {
        console.log(data)
    }
  return (
    <div className="h-full w-full mt-5 flex flex-col justify-center items-center">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(HandleSubmit)} className="space-y-6">
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </form>
        </Form>
    </div>
  )
}

export default UpdateAvatar