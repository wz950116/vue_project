import combine from './lib/combine.js'
import domain from './lib/domain-base.js'

var init = function (params, fn) {
    var request = [{
        url: `${domain}authority/person/getAllBackEndRolesAndPermissions`,
        method: 'POST',
        params: params
    }]

    combine(request, function (data) {
        if (parseInt(data[0].code) === 200) {
            fn(data[0])
        }
    })
}

export default init