import { ElevenLabsClient } from 'elevenlabs';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

export const voiceCloneAdd = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    // Uploading on eleven labs
    const response = await client.voices.add({
      files: [fs.createReadStream(localFilePath)],
      name: 'Voice Clone',
      description: 'Voice clone of the user for further processing in future',
    });
    fs.unlinkSync(localFilePath); // remove the locally stored file from the server as the upload was unsuccessful
    console.log(response)
    return response;
  } catch (error) {
    console.log('Error in Eleven Labs upload in utilities folder', error);
    fs.unlinkSync(localFilePath); // remove the locally stored file from the server as the upload was unsuccessful
    return null;
  }
}

export const getVoiceClone = async (voiceId: string) => {
  try {
    if (!voiceId) return null;
    const response = await client.voices.get(voiceId);
    return response;
  } catch (error) {
    console.log('Error in getting Eleven Labs voice clone', error);
    return null;
  }
}

export const deleteVoiceClone = async (voiceId: string) => {
  try {
    if (!voiceId) return null;
    const response = await client.voices.delete(voiceId);
    return response;
  } catch (error) {
    console.log('Error in deleting Eleven Labs voice clone', error);
    return null;
  }
}