import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "@/services/auth.ts";
import { loginSchema } from "@/schemas/loginSchema.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store.ts";
import { storeLogin } from "@/store/Auth/authSlice.ts";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false);

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await login(data);
      console.log(res);
      toast("User logged in successfully", {
        description: "Successful✅",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
      dispatch(storeLogin(res.data.data.user));
      navigate("/home");
      setIsSubmitting(false);
    } catch (error: any) {
      setIsSubmitting(false);
      toast("Error occured while logging in user", {
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
            Don't have an account ?{" "}
            <span
              className="text-blue-300 hover:text-blue-600 underline cursor-pointer text-sm"
              onClick={() => navigate("/send-otp")}
            >
              Sign Up
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <p
                className="text-xs text-blue-300 hover:text-blue-600 underline cursor-pointer text-right"
                onClick={() => navigate("/forgot-password-email")}
              >
                Forgot Password
              </p>
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
  );
};

export default SignIn;
