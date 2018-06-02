import Vue from 'vue'
import Vuex from 'vuex'

import userInfo from "./modules/userInfo"
import cityInfo from "./modules/cityInfo"

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		userInfo,
		cityInfo
	}
})