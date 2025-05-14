import { getToken } from "firebase/messaging";
import { messaging } from "@/config/firebaseConfig";
import { saveFCM } from "@/services/auth";

export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission()

        if(permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID
            })

            const res = await saveFCM(token)

            console.log(res)
        }
    } catch (error) {
        console.error("FCM permission error: ", error)
    }
}