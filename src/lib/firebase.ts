/**
 * Firebase singleton for oriz-finance.
 *
 * The actual init lives in @chirag127/oriz-ui's lib/firebase. We just hand it
 * the env vars Astro exposes at build time. Every site in the oriz family
 * initializes the same project (oriz-app) so a logged-in user follows you
 * across every *.oriz.in subdomain.
 */
import { initFirebase } from '@chirag127/oriz-ui'

const env = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
}

export const { app, auth, db } = initFirebase(env)
