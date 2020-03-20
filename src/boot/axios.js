import axios from 'axios'
// import service from 'request'
export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
}
