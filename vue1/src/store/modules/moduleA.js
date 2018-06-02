import { A } from "../mutations_type"

const state = {
	show: false,
	say: 'javascript'
}

const mutations = {
	[A] (state) {
		state.show = !state.show
	}
}

const actions = {
	isShow ({commit}, boolean) {
		commit(A, boolean);
	}
}

export default {
	state,
	mutations,
	actions
}