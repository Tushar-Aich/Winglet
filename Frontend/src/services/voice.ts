import api from "./axios"


export const VoiceClone = async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('voice', audioBlob, 'voice.wav')

    const res = await api.post('/voice/clone', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data.data
}

