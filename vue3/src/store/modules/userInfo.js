import { USERINFO } from "../mutations_type"

const state = {
	info: '',
}

const mutations = {
	[USERINFO] (state, data) {
		state.info = data;
	}
}

const actions = {
	infoData ({commit}, data) {
		commit(USERINFO, data);
	}
}

export default {
	state,
	mutations,
	actions
}