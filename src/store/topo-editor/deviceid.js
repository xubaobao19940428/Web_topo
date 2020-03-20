
const getDevices = {
  state: {
    deviceId:''
  },

  mutations: {
    set_Device_Id(state,deviceId){
        state.deviceId = deviceId
    }
  },

  actions: {
    getDeviceId({dispatch},deviceId){
        dispatch('setDeviceId',deviceId)
    },
    setDeviceId({commit},deviceId){
        commit('set_Device_Id',deviceId)
    }
  }
}

export default getDevices
