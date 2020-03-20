import Vue from 'vue'
import Vuex from 'vuex'

import example from './module-example'
import topoEditor from './topo-editor';
import getDevices from './topo-editor/deviceid'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      example,
      topoEditor,
      getDevices
    },
    mutations: {
      set_Config_Data(state,configdata){
          state.topoEditor= configdata
      }
    },
    actions:{
      getConfigData({dispatch},configdata){
          dispatch('setConfigData',configdata)
      },
      setConfigData({commit},configdata){
          commit('set_Config_Data',configdata)
      }
    }
  })

  return Store
}
