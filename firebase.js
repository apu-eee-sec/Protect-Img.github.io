  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAVKNZAG9pfZ8NHh14BrnwMRwXgl17wqPg",
    authDomain: "personal-portfolio-5a359.firebaseapp.com",
    projectId: "personal-portfolio-5a359",
    storageBucket: "personal-portfolio-5a359.firebasestorage.app",
    messagingSenderId: "228825738620",
    appId: "1:228825738620:web:4e9b950010c50eeb7288f9",
    measurementId: "G-6Y4X83LM3M"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
