export interface AppConfig {
  authEnabled: boolean;
  title: string;
  markdownPath: string;
  apiUrl: string;
  firebaseConfig: FirebaseConfig;
  azure: Azure;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface Azure {
  appInsights: AppInsights;
}

export interface AppInsights {
  instrumentationKey: string;
}
