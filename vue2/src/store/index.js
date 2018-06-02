import Vue from 'vue'
import Vuex from 'vuex'

import a from "./modules/moduleA"
import * as getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
	getters,
	modules: {
		a
	}
})