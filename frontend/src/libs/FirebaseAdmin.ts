import firebaseAdmin from 'firebase-admin'

export class FirebaseAdmin {
  private static _instance: FirebaseAdmin
  private _auth: firebaseAdmin.auth.Auth

  private constructor() {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    })
    this._auth = firebaseAdmin.auth()
  }

  public static get instance(): FirebaseAdmin {
    if (!this._instance) {
      this._instance = new FirebaseAdmin()
    }
    return this._instance
  }

  public get auth() {
    if (this._auth) {
      return this._auth
    } else {
      this._auth = firebaseAdmin.auth()
      return this._auth
    }
  }
}
