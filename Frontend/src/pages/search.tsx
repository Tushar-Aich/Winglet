import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { searchSchema } from "@/schemas/SearchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const search = () => {
  const [submitting, setSubmitting] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: ""
    },
  });
  const handleSubmit = async (data: z.infer<typeof searchSchema>) => {
    console.log(data);
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
                  <Input placeholder="Search Tweet or User..." {...field}/>
                </FormControl>
              </FormItem>
            )}
          />
          {submitting ? (
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
      
    </div>
  );
};

export default search;
