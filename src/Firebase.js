import firebase from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyC5nvGd1BlbH-0Erfr8N8a3J-IyS2tipEc',
  authDomain: 'cronometro-56228.firebaseapp.com',
  databaseURL: 'https://cronometro-56228.firebaseio.com',
  projectId: 'cronometro-56228',
  storageBucket: 'cronometro-56228.appspot.com',
  messagingSenderId: '137104941405',
  appId: '1:137104941405:web:c35757207577b9320a48b4',
  measurementId: 'G-SG2SYFV2FQ'
}
firebase.initializeApp(config)
export default firebase
