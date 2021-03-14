import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

export type FirebaseUser = firebase.User

export class FirebaseClient {
  private static _instance: FirebaseClient
  private _db: firebase.firestore.Firestore
  private _auth: firebase.auth.Auth
  private _storage: firebase.storage.Storage

  public authProviders = {
    google: new firebase.auth.GoogleAuthProvider(),
    twitter: new firebase.auth.TwitterAuthProvider(),
    facebook: new firebase.auth.FacebookAuthProvider(),
  }

  private constructor() {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      })
    }
    this._db = firebase.firestore()
    this._auth = firebase.auth()
    this._storage = firebase.storage()
  }

  public static get instance(): FirebaseClient {
    if (!this._instance) {
      this._instance = new FirebaseClient()
    }
    return this._instance
  }

  public get db() {
    if (this._db) {
      return this._db
    } else {
      this._db = firebase.firestore()
      return this._db
    }
  }

  public serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  public get auth() {
    if (this._auth) {
      return this._auth
    } else {
      this._auth = firebase.auth()
      return this._auth
    }
  }

  public get storage() {
    if (this._storage) {
      return this._storage
    } else {
      this._storage = firebase.storage()
      return this._storage
    }
  }

  public get storageTaskEvent() {
    return firebase.storage.TaskEvent
  }
}
