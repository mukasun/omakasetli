import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import { FirestoreSimple } from '@firestore-simple/web'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

class Firebase {
  private static _instance: Firebase
  private _db: FirestoreSimple
  private _auth: firebase.auth.Auth
  private _storage: firebase.storage.Storage
  public authProviders = {
    google: new firebase.auth.GoogleAuthProvider(),
  }

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
    this._db = new FirestoreSimple(firebase.firestore())
    this._auth = firebase.auth()
    this._storage = firebase.storage()
  }

  public static get instance(): Firebase {
    if (!this._instance) {
      this._instance = new Firebase()
    }
    return this._instance
  }

  public get db() {
    if (this._db) {
      return this._db
    } else {
      this._db = new FirestoreSimple(firebase.firestore())
      return this._db
    }
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

  public get serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  public get storageTaskEvent() {
    return firebase.storage.TaskEvent
  }
}

export default Firebase
