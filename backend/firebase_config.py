import firebase_admin
from firebase_admin import credentials, firestore, db

# Initialize Firebase Admin SDK
def initialize_firebase():
    # Use your Firebase project credentials JSON file path here
    cred = credentials.Certificate('path/to/your/firebase-service-account.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://your-project-id.firebaseio.com'
    })

def get_firestore_client():
    if not firebase_admin._apps:
        initialize_firebase()
    return firestore.client()

def get_realtime_db():
    if not firebase_admin._apps:
        initialize_firebase()
    return db.reference()
