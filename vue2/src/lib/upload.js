import {
    hex_sha1
} from './md5.js';

function upload(module, file, fn) {
    var uploadurl = 'http://gz.file.myqcloud.com/files/v2/1252684967/focusimg/xf/' + module + '/' + file.name;
    var exportData = {};

    getToken(module, file, function (token) {

        var uploadData = {
            sh: hex_sha1(file), // 需md5
            op: "upload",
            filecontent: file,
            biz_attr: '',
            insertOnly: 0
        }
        var uploadHeaders = {
            'Host': 'gz.file.myqcloud.com',
            'Authorization': token 
        };

        var formData = new FormData();

        for (name in uploadData) {
            formData.append(name, uploadData[name]);
        }
      
        fetch(uploadurl, {
            method: 'post',
            //mode:'no-cors',
            headers: uploadHeaders,
            body: formData
        }, {}).then(function (res) {

            res.json().then(function (obj) {

                if (obj.code === 0) {
                    exportData.uploadPath = obj.data.resource_path.split('focusimg')[1];
                    exportData.fullPath = obj.data.access_url;
                    console.log(exportData.uploadPath);
                    console.log(exportData.fullPath);
                    //resolve()
                    fn(exportData)
                } else {
                    //reject(obj);
                }
            });
        }, function (err) {
            //reject(err);
        });

    })

}


function getToken(module, file, fn) {

    var url = 'http://house-sv-base.focus-dev.cn/qcloud/token?myField=/xf/' + module + '/' + file.name;

    fetch(url, {
        method: 'get',
        // mode: 'no-cors',
    }, {}).then(function (res) {
        res.json().then(function (obj) {

            if (obj.code === 1) {
                fn && fn(obj.data);
            } else {
                //reject( obj);
            }
        });
    }, function (err) {
        //reject(err);
    });
}

export default upload;