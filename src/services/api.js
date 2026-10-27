import axios from 'axios'

const api = axios.create({
  baseURL: 'https://mediapp-react.onrender.com/api'
})

export default api