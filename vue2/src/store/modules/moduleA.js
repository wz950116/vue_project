import { A } from "../mutations_type"

const state = {
	mapSearch: {
		city: '',
		content: ''
	},
	test: ''
}

const mutations = {
	[A] (state, value) {
		state.test = value
	}
}

const actions = {
	init ({commit}, value) {
		commit(A, value);
	}
}

export default {
	state,
	mutations,
	actions
}