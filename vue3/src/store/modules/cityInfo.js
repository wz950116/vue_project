import { CITYINFO } from "../mutations_type"

const state = {
    info: '',
}

const mutations = {
    [CITYINFO] (state, data) {
        state.info = data;
    }
}

const actions = {
    cityData ({commit}, data) {
        commit(CITYINFO, data);
    }
}

export default {
    state,
    mutations,
    actions
}