import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "@/schemas/EmailVerification.ts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form.tsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { sendEmail } from "@/services/auth.ts";


const SendOTP = () => {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false);

  const handleSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await sendEmail(data)
      console.log(res)
      toast("Email sent successfully", {
        description: "Successful✅",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
      localStorage.setItem('email', data.email)
      localStorage.setItem('emailSent', res.data.data.status)
      navigate('/verify-otp')
    } catch (error) {
      setIsSubmitting(false)
      toast("Error occured while logging in user", {
        description: "Please try again",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
      console.error(error)
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="px-8 py-8 dark:border-white border-black border rounded-lg md:px-20">
        <div className="space-y-0.5 text-center">
          <div className="flex justify-center items-center space-x-2">
            <img
              src="./Transparent-logo.jpg"
              alt="Logo"
              className="h-8 w-8 rounded-full md:h-12 md:w-12"
            />
            <p className="text-2xl font-bold md:text-4xl">Winglet</p>
          </div>
          <p className="text-md text-muted-foreground md:text-xl">
            Open your wings, connect with world.
          </p>
          <p>
            Already have an account ?{" "}
            <span
              className="text-blue-300 hover:text-blue-600 underline cursor-pointer text-sm"
              onClick={() => navigate("/")}
            >
              Sign In
            </span>
          </p>
        </div>
        <div className="mt-8">
        <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {isSubmitting ? (
                <Button
                  type="submit"
                  className="relative left-[50%] -translate-x-[50%] "
                  disabled
                >
                  Submitting
                  <Loader2 className="animate-spin" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="relative left-[50%] -translate-x-[50%] cursor-pointer"
                >
                  Submit
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SendOTP