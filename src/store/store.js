import { configureStore } from '@reduxjs/toolkit'
import servidorP from "./states/servidorP.slice"

export default configureStore({
  reducer:{
    servidorP
  }
})



