import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

export default defineNuxtPlugin((nuxtApp) => {
    let firebaseApp: FirebaseApp | undefined;

    function getFirebaseApp(): FirebaseApp {
        if (typeof window === 'undefined') throw new Error('Firebase só pode ser usado no client');
        if (!firebaseApp) {
            const config = useRuntimeConfig().public;
            firebaseApp = initializeApp({
                apiKey: config.firebaseApiKey as string,
                authDomain: config.firebaseAuthDomain as string,
                projectId: config.firebaseProjectId as string,
                storageBucket: config.firebaseStorageBucket as string,
                messagingSenderId: config.firebaseMessagingSenderId as string,
                appId: config.firebaseAppId as string,
            });
        }
        return firebaseApp;
    }

    function getFirebaseAuth(): Auth {
        return getAuth(getFirebaseApp());
    }

    function getGoogleProvider(): GoogleAuthProvider {
        return new GoogleAuthProvider();
    }

    nuxtApp.provide('firebase', {
        getFirebaseAuth,
        getGoogleProvider,
    });
});
