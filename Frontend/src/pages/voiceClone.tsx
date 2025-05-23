import { useRef, useState, useEffect } from "react"
import { useVoiceClone } from '@/Hooks/useVoiceClone'
import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import WaveSurfer from 'wavesurfer.js'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Mic, StopCircle, UploadCloud, Loader2 } from "lucide-react"
import { toast } from "sonner"

const voiceClone = () => {
    const recordRef = useRef<RecordRTC | null>(null)
    const waveFormRef = useRef<HTMLDivElement | null>(null)
    const waveSurferRef = useRef<WaveSurfer | null>(null)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    const CloneMutation = useVoiceClone()

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        noiseSuppression: true,
        echoCancellation: true,
      } })
      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: StereoAudioRecorder,
        desiredSampRate: 16000
      })
      recorder.startRecording()
      recordRef.current = recorder
      setIsRecording(true)
    }

    const stopRecording = () => {
      recordRef.current?.stopRecording(() => {
        const blob = recordRef.current?.getBlob()
        if(blob) {
          setAudioBlob(blob)
          setAudioUrl(URL.createObjectURL(blob))
        }
        setIsRecording(false)
      })
    }

    const handleUpload = () => {
      if(!audioBlob) {
        toast("Please record your voice", {
          description: "Please try again",
          action: {
            label: "X",
            onClick: () => console.log("dismiss"),
          },
        })
        return
      }
      console.log(audioBlob)
      CloneMutation.mutate(audioBlob, {
        onSuccess: () => {
          toast("Voice cloned succesfully", {
            description: "Successful✅",
            action: {
              label: "X",
              onClick: () => console.log("dismiss"),
            },
          })
        },
        onError: () => {
          toast("Voice cloning unsuccessful", {
            description: "Please try again",
            action: {
              label: "X",
              onClick: () => console.log("dismiss"),
            },
          })
        }
      })
    }

    useEffect(() => {
      if(audioUrl && waveFormRef.current) {
        waveSurferRef.current?.destroy()
        waveSurferRef.current = WaveSurfer.create({
          container: waveFormRef.current,
          waveColor: "#4f46e5",
          progressColor: '#6366f1',
          height: 100,
          barWidth: 2,
          barRadius: 2,
          cursorWidth: 1,
          normalize: true,
        })
        waveSurferRef.current.load(audioUrl)
      }
    }, [audioUrl])
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Card className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex justify-center items-center gap-2">
            <Mic className="w-6 h-6" />
            Record Audio
          </CardTitle>
          <CardDescription className="text-sm">Record your voice, preview it, and upload with beautiful visualization</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button onClick={startRecording} disabled={isRecording!}><Mic className="h-4 w-4 mr-2" /> Start </Button>
            <Button onClick={stopRecording} disabled={!isRecording!}><StopCircle className="h-4 w-4 mr-2" /> Stop </Button>
            <Button onClick={handleUpload}>
              {CloneMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-2"/>
                  Upload
                </>
              )}
            </Button>
          </div>

          {audioUrl && (
            <div className="space-y-4">
              <audio src={audioUrl} controls className="w-full"></audio>
              <div className="w-full h-[100px]" ref={waveFormRef}></div>
            </div>
          )}
        </CardContent>

        <CardFooter className="text-xs text-muted-foreground text-center">
          Tip: Allow mic access to record audio properly
        </CardFooter>
      </Card>
    </div>
  )
}

export default voiceClone