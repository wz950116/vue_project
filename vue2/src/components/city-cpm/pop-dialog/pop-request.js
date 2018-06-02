import combine from '../../../script/data/proxy/lib/combine.js';
import domain from '../../../script/data/proxy/lib/domain-base.js';

export default {
    // 上传图片
    uploadImage(params, fn){
        var request = [{
            url:`${domain}resource/image/upload/`,
            method: "POST",
            params: params
        }];
        combine(request, function(data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    addResource(params, fn) {
        let request = [{
            url: `${domain}resource/addResource`,
            method: 'POST',
            params: params
        }];

        combine(request, function(data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    addPreview(params, fn) {
        let request = [{
            url: `${domain}resource/addPreview`,
            method: 'POST',
            params: params
        }];

        combine(request, function(data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    updatePreview(params, fn) {
        let request = [{
            url: `${domain}resource/updatePreview`,
            method: 'POST',
            params: params
        }];

        combine(request, function(data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
};
