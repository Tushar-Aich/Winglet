importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

firebase.initializeApp({
    apiKey: "AIzaSyBVi76ZrJq3U3Gnm3hyzV1N7eVjLOvc-G8",
    authDomain: "winglet-35150.firebaseapp.com",
    projectId: "winglet-35150",
    storageBucket: "winglet-35150.firebasestorage.app",
    messagingSenderId: "495346443597",
    appId: "1:495346443597:web:ac62b9bb52cb2bbb02c304",
    measurementId: "G-0KM66VWTVC"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    const { title, body } = payload.notification;
    self.registration.showNotification(title, {
        body,
        icon: './Transparent-logo.jpg'
    })
})