import { configureStore } from '@reduxjs/toolkit'
import servidorP from "./states/servidorP.slice"
import alert from './states/alert.slice'

export default configureStore({
  reducer:{
    servidorP,
    alert
  }
})



