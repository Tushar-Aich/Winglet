import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useGetUser } from "@/Hooks/useQueries"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Image, Loader2, Send, SmilePlus } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInView } from "react-intersection-observer"
import { useGetChatMessages } from "@/Hooks/useInfiniteQuery"
import { Message } from "@/Interfaces"
import { useEffect, useRef, useState } from "react"
import { IconChecks } from "@tabler/icons-react"
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { MessageSchema } from "@/schemas/tweetSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"

const ChatPage = () => {

  const [text, setText] = useState<string>("")
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  const fileRef = useRef<HTMLInputElement | null>(null)
  
  const { theme } = useTheme()

  const { chatId } = useParams()
  if(!chatId) throw new Error("Id not found");
  const user = useGetUser(chatId!)
  const recepientUser = user?.data
  const navigate = useNavigate()

  const { ref, inView } = useInView()

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [])

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    isError,
    error,
    refetch
  } = useGetChatMessages(chatId)

  const messages = data?.pages.flat().reverse() as Message[] || []

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const groupMessagesByDate = () => {
    const groups: Record<string, Message[]> = {}

    messages.forEach((message) => {
      const date = parseISO(message?.createdAt)
      let label: string

      if (isToday(date)) label = 'Today';
      else if (isYesterday(date)) label = "Yesterday";
      else if(isThisWeek(date)) label = format(date, 'EEEE');
      else label = format(date, 'MMM d, yyyy');

      if(!groups[label]) groups[label] = [];
      groups[label].push(message)
    })

    return groups
  }
  const groupedMessages = groupMessagesByDate()

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
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

  const HandleSubmit = async (data: z.infer<typeof MessageSchema>) => {
    console.log(data)
  }

  return (
    <div className="">
      <Card className="flex-1 h-[95vh] overflow-y-hidden">
        <CardHeader className="border-b-2 border-b-muted-foreground py-2 mx-1 flex items-center space-x-3">
          <Button 
            variant="ghost" 
            className="text-muted-foreground cursor-pointer"
            onClick={() => navigate("/home/inbox")}
          >
            <ArrowLeft className="scale-150"/>
          </Button>
          <Avatar>
            <AvatarImage src={recepientUser?.avatar} />
            <AvatarFallback>{recepientUser?.OGName?.[0].toString()}</AvatarFallback>
          </Avatar>
          <h1 className="text-accent-foreground font-bold text-xl">{recepientUser?.OGName}</h1>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full h-[78vh] px-2">
            {Object.entries(groupedMessages).map(([label, messages]) => (
              <div key={label}>
                <div className="flex justify-center my-2">
                  <span className="bg-muted-foreground text-white dark:text-black text-sm px-3 py-1 rounded-full">{label}</span>
                </div>
                {messages.map((message, idx) => (
                  <>
                  <div
                    key={idx}
                    className={`flex items-start my-4 ${message.sender?._id === recepientUser?._id ? "justify-start " : "justify-end"}`}
                  >
                    {message.sender?._id === recepientUser?._id ? (
                      <>
                        <div>
                          <Avatar>
                            <AvatarImage src={message.sender?.avatar} />
                            <AvatarFallback>{message.sender?.OGName?.[0].toString()}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="py-2 px-5 bg-black rounded-sm text-gray-200 ml-2">
                          {message.content ? message.content : null}
                          {message.images ? (
                            <img src={message.images} className="rounded-lg max-w-xs max-h-60 object-cover" />
                          ) : null}
                          <div className="mt-1 flex justify-between gap-2">
                            <IconChecks height="18" color={message?.read ? "#007bff" : "currentColor"} />
                            <h1 className="text-xs text-muted-foreground">{format(parseISO(message?.createdAt), "h:mm a")}</h1>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="py-2 px-5 bg-gray-200 text-black rounded-sm mr-2">
                          {message.content ? message.content : null}
                          {message.images ? (
                            <img src={message.images} className="rounded-lg max-w-xs max-h-60 object-cover" />
                          ) : null}
                          <div className="mt-1 flex justify-between gap-2">
                            <IconChecks height="18" color={message?.read ? "#007bff" : "currentColor"} />
                            <h1 className="text-xs text-zinc-700">{format(parseISO(message?.createdAt), "h:mm a")}</h1>
                          </div>
                        </div>
                        <div>
                          <Avatar>
                            <AvatarImage src={message.sender?.avatar} />
                            <AvatarFallback>{message.sender?.OGName?.[0].toString()}</AvatarFallback>
                          </Avatar>
                        </div>
                      </>
                    )}
                  </div>
                  </>
                ))}
              </div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            {/* Infinite Scroll Loader - This is where the intersection observer is attached */}
            {!isLoading && hasNextPage && (
              <div 
                ref={ref} 
                className="flex justify-center p-4"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <p className="text-sm text-muted-foreground">Scroll for more</p>
                )}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && messages.length === 0 && !isError && (
              <div className="text-center p-8">
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-muted-foreground mt-1">Be the first to share something!</p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mx-4">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  Error loading messages: {(error as Error)?.message || "Something went wrong"}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="w-full">
          <form onSubmit={handleSubmit(HandleSubmit)} className="flex items-center py-2 w-full space-x-3">
            <div  className="flex gap-6 m-2">
              <div>
                {preview ? (
                  <img src={preview} className="h-5 w-5 rounded-full" onClick={() => {
                    setPreview(null)
                    if(fileRef.current) fileRef.current.value = "";
                    setValue("media", undefined)
                  }} />
                ) : (
                  <>
                    <Image className="h-6 w-6 text-black dark:text-white cursor-pointer" onClick={() => {
                      handleIconClick()
                      setOpen(true)
                    }} />
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
                  </>
                )}
                {preview && (
                  <>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="bg-transparent backdrop-blur-sm py-10">
                      <img
                        src={preview}
                        alt="Tweet media"
                        className="max-h-[calc(80vh-2rem)] w-auto mx-auto object-contain rounded-lg"
                      />
                      <DialogClose className="absolute bottom-0 left-[50%] -translate-x-[50%]">
                        <Button className="px-5 py-3" onClick={() => setOpen(false)}>Done</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                  </>
                )}
              </div>
              <div>
                <SmilePlus className="h-6 w-6 text-black dark:text-white cursor-pointer" onClick={() => setShowPicker(prev => !prev)}/>
                {showPicker && (
                  <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-10">
                    <EmojiPicker 
                      onEmojiClick={handleEmojiSelect}
                      theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
                    />
                  </div>
                )}
              </div>
            </div>
            <Input
              className="w-full"
              placeholder="Write your message here..."
              {...register("content")}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {errors.content && <p className="text-red-500 font-bold text-sm">{errors.content.message}</p>}
            {isSubmitting ? (
              <Button
                type="submit"
                className="font-bold text-lg px-6 py-4"
                disabled
              >
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="font-bold text-lg px-6 py-4 cursor-pointer"
              >
                <Send />
              </Button>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ChatPage