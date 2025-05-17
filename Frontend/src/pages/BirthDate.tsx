import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUpdateBirthDate } from "@/Hooks/useUpdate"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { QueryClient } from "@tanstack/react-query"

const BirthDateSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})

const BirthDate = () => {
  const form = useForm<z.infer<typeof BirthDateSchema>>({
    resolver: zodResolver(BirthDateSchema),
  })

  const updateBirthDateMutation = useUpdateBirthDate()

  const navigate = useNavigate()

  const rootUser = useSelector((state: RootState) => state.user.user)
  
  const userId = rootUser?._id

  const queryClient = new QueryClient()

  function onSubmit(data: z.infer<typeof BirthDateSchema>) {

    const formatted = {
        ...data,
        dob: format(data.dob, "dd-MM-yyyy")
    }

    console.log(formatted.dob)

    updateBirthDateMutation.mutate(formatted.dob, {
        onSuccess: () => {
              toast("Birth Date update successfully", {
              action: {
                label: "Go to profile",
                onClick: () => navigate(`/home/profile/${rootUser?._id}`)
              }
            })
            queryClient.invalidateQueries({ queryKey: ["user", { userId: userId }] })
        },
        onError: () => {
          toast("Error updating Birth Date", {
            description: "Please try again."
          })
        }
    })
  }

  return (
    <div className="h-full w-screen mt-10 flex flex-col justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {updateBirthDateMutation.isPending ? (
              <Button
                type="submit"
                className="font-bold text-lg px-6 py-4"
                disabled
              >
                Adding Birth Date
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="font-bold text-lg px-6 py-4 cursor-pointer"
              >
                Add Birth Date
              </Button>
            )}
          </form>
        </Form>
    </div>
  )
}

export default BirthDate