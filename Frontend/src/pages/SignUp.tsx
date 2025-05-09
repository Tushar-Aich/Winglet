import { SignUpSchema } from "@/schemas/signUpSchema";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import ImageUpload from "@/components/ImageUpload.tsx";
import { signUp } from "@/services/auth.ts";
import Logo from "@/Assets/Transparent-logo.jpg";

const SignUp = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email")!;
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      userName: "",
      OGName: "",
      password: ""
    }
  });
  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false);
  const handleSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await signUp(data, email);
      console.log(res);
      toast("User Signed Up successfully", {
        description: "Successful✅",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
      navigate("/");
      localStorage.removeItem('email')
      localStorage.removeItem('OTPmatched')
      localStorage.removeItem('emailSent')
      setIsSubmitting(false);
    } catch (error: any) {
      setIsSubmitting(false);
      toast("Error occured while Signing Up user❌", {
        description: "Please try again",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
      console.log(error);
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-form">
      <CardHeader>
        <CardTitle className="flex justify-center items-center space-x-2">
          <img
            src={Logo}
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
          <p className="text-2xl font-bold">Winglet</p>
        </CardTitle>
        <CardDescription className="text-center">
          <p className="text-md text-muted-foreground md:text-xl">
            Open your wings, connect with world.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            <FormField 
              control={form.control}
              name="userName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="example106" {...field}/>
                  </FormControl>
                  <FormDescription>This will be your unique identifier</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="OGName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Example example" {...field}/>
                  </FormControl>
                  <FormDescription>How you wnat to be addressed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field}/>
                  </FormControl>
                  <FormDescription>Password must be minimum 8 characters long</FormDescription>
                  <FormMessage />
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
      </CardContent>
    </Card>
    </div>
  );
};

export default SignUp;