import Axios from 'axios'
import Vue from 'vue'

let mock = false // true
let baseURL = 'http://127.0.0.1:3000';

// response拦截器
Axios.interceptors.response.use(response => {
    return response.data
}, error => {
    return Promise.reject(error)
})

let request = {
    post(url, params) {
        return Axios({
            url: url,
            method: 'post',
            baseURL: baseURL,
            data: params,
            withCredentials: true
        }).catch(err => {
            console.log(err)
        })
    },
    get(url, params) {
        return Axios({
            url: url,
            method: 'get',
            baseURL: baseURL,
            params: params,
            withCredentials: true,
        }).catch(err => {
            console.log(err)
        })
    },
    jsonp(url, params) {
        return Vue.jsonp(url, params)
    }
}
export default request
