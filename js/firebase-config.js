window.firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

window.readoraFirebaseReady = Boolean(
  window.firebaseConfig &&
  window.firebaseConfig.apiKey &&
  window.firebaseConfig.authDomain &&
  window.firebaseConfig.projectId &&
  window.firebaseConfig.appId
);
