import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchUser } from "@/Hooks/useSearchUser";
import { searchSchema } from "@/schemas/SearchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type user = {
  OGName: string;
  userName: string;
  avatar: string;
  _id: string
}

const search = () => {

  const [searchedUser, setSearchedUser] = useState<user[]>([])

  const navigate = useNavigate()

  const searchUserMutation = useSearchUser()

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: ""
    },
  });

  const handleSubmit = async (data: z.infer<typeof searchSchema>) => {
      searchUserMutation.mutate(data.query, {
        onSuccess: (res) => {
          setSearchedUser(res)
        },
        onError: (error: any) => {
          console.log(error)
        }
      })
  };
  return (
    <div className="h-full w-full">
      <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search</FormLabel>
                <FormControl>
                  <Input placeholder="Search User..." {...field}/>
                </FormControl>
              </FormItem>
            )}
          />
          {searchUserMutation.isPending ? (
            <Button
              type="submit"
              className="relative left-[50%] -translate-x-[50%] "
              disabled
            >
              Searching
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="relative left-[50%] -translate-x-[50%] cursor-pointer"
            >
              Search
            </Button>
          )}
        </form>
      </Form>
      </div>
      {searchedUser.length > 0 ? (
        <div className="w-full md:grid md:grid-cols-3 md:space-x-4">
          {searchedUser.map((user, idx) => (
            <Card
              key={idx}
              className="mt-4 p-2 md:flex md:flex-col justify-center items-center cursor-pointer"
              onClick={() => navigate(`/home/profile/${user._id}`)}
            >
              <CardContent>
                <img src={user.avatar} alt="pfp" className="h-20 w-20 rounded-full object-cover"/>
              </CardContent>
              <CardFooter className="flex flex-col text-center">
                <h1 className="font-bold text-lg">{user.OGName}</h1>
                <h1 className="font-bold text-sm text-muted-foreground">{user.userName}</h1>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default search;
