import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { TweetSchema } from "@/schemas/tweetSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Image, Loader2, SmilePlus } from "lucide-react"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { createTweet } from "@/services/tweet"
import { toast } from "sonner"

const Home = () => {
  const [text, setText] = useState<string>("")

  const [showPicker, setShowPicker] = useState<boolean>(false)

  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false);

  const [preview, setPreview] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement | null>(null)
  
  const { theme } = useTheme()

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<z.infer<typeof TweetSchema>>({
    resolver: zodResolver(TweetSchema),
    defaultValues: {
      content: ""
    }
  })
 
  const handleEmojiSelect = (emoji: any) => {
    setText(prev => prev + emoji.emoji)
  }

  const handleIconClick = () => {
    fileRef.current?.click()
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      setValue("media", file)
      const imgURL = URL.createObjectURL(file)
      setPreview(imgURL)
    }
  }


  const HandleSubmit = async (data: z.infer<typeof TweetSchema>) => {
    setIsSubmitting(true)
    try {
      // Ensure text is properly set as content
      data.content = text; // Update content with the text state
      
      // Log with JSON.stringify to properly display emojis in console
      console.log("Tweet data:", data);
      console.log("Content with emojis:", JSON.stringify(data.content));
      
      const res = await createTweet(data)
      console.log("Response:", res.data)
      toast("Tweet Posted successfully", {
        description: "Successful✅",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast("Error occured while creating tweet❌", {
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
    <div className="h-full w-full">
      <Card className="w-full p-4 relative top-0 left-0">
        <CardContent>
            <form onSubmit={handleSubmit(HandleSubmit)}>
              <Textarea
                {...register("content")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind today"
                className="h-32 w-full resize-none text-lg md:text-xl font-bold"
              />
              {errors.content && <p className="text-red-500 font-bold text-sm md:text-lg">{errors.content.message}</p>}
              <div className="flex justify-between items-center mt-4">
                <div  className="flex gap-6 ml-2">
                  <div>
                    <Image className="h-6 w-6 text-black dark:text-white cursor-pointer" onClick={handleIconClick}/>
                    <Input
                      type="file"
                      accept="image/jpg image/jpeg image/png"
                      {...register("media")}
                      ref={(e) => {
                        fileRef.current = e
                      }}
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                    {preview && (
                      <img src={preview} alt="image" className="h-32 w-32 rounded-lg object-cover" onClick={() => {
                        setPreview(null)
                        if(fileRef.current) fileRef.current.value = "";
                        setValue("media", undefined)
                      }}/>
                    )}
                  </div>
                  <div>
                    <SmilePlus className="h-6 w-6 text-black dark:text-white cursor-pointer" onClick={() => setShowPicker(prev => !prev)}/>
                    {showPicker && (
                      <div className="absolute z-10">
                        <EmojiPicker 
                          onEmojiClick={handleEmojiSelect}
                          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4 mr-2">
                  {text.length > 150 ? (
                    <div>
                      <h1 className="text-red-500 font-bold text-xl">
                        {text.length}
                      </h1>
                      <p className="text-red-500 font-bold text-sm md:text-lg">
                        Can't post more than 150 characters
                      </p>
                    </div>
                  ) : (
                    <h1 className=" font-bold text-xl">{text.length}</h1>
                  )}
                  {isSubmitting ? (
                    <Button
                      type="submit"
                      className="font-bold text-lg px-6 py-4"
                      disabled
                    >
                      Posting
                      <Loader2 className="animate-spin" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="font-bold text-lg px-6 py-4 cursor-pointer"
                    >
                      Post
                    </Button>
                  )}
                </div>
              </div>
            </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home