/**
 * Created by leijia206223 on 2016/10/27.
 */

class AppData {
    constructor() {
        this.insert();
    };
    insert(){

    };
    getData(tag,name,callback){
        let tag_name = tag.self_name,
        file_name = name;

        fetch('/api/'+tag_name+'/'+file_name+'.json').then(function(res) {
            if (res.ok) {
                res.json().then(function(obj) {
                    // Get the JSON
                    callback(obj);
                })
            }
        }, function(ex) {
            console.log(ex)
        })
    }
}

export default AppData;
