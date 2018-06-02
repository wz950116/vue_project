import combine from '../../../script/data/proxy/lib/combine.js';
import domain from '../../../script/data/proxy/lib/domain-base.js';

export default {
    // 获取表头数据
    getTheadData(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/index`,
            method: 'POST',
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 插入楼盘
    insertLoupan(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/insert`,
            method: 'POST',
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 获取楼盘搜索数据
    getLoupanSuggest(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/searchSuggest`,
            method: 'POST',
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 获取开发商列表
    getCompanyList(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/getCompanyList`,
            method: 'POST',
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 插入负责小组
    insertGroup(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/insertGroup`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 编辑负责小组
    updateGroupInfo(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/updateGroupInfo`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 删除负责小组
    deleteGroup(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/deleteEstateGroupById`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 新增组员
    addGroupMember(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/setGroupMember`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 更新组员信息
    updateGroupMemberInfo(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/updateGroupMemberInfo`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 删除组员
    deleteGroupMember(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/deleteGroupMember`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 根据负责小组获取负责人
    getPrincipalNameListByGroupList(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/getPrincipalNameListByGroupList`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 获取运营负责人列表
    getBusinesseLeaderList(params, fn) {
        params.type = 1;
        let request = [{
            url: `${domain}adEstateIndices/getPrincipalListByLikeName`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 获取销售负责人列表
    getSalesLeaderList(params, fn) {
        params.type = 2;
        let request = [{
            url: `${domain}adEstateIndices/getPrincipalListByLikeName`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 设定城市负责人
    setCityPrincipal(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/setCityPrincipal`,
            method: 'POST',
            params: {
                cityId: params.cityId,
                name: params.operatorName,
                email: params.operatorEmali,
                type: 1 // 运营负责人
            }
        }, {
            url: `${domain}adEstateIndices/setCityPrincipal`,
            method: 'POST',
            params: {
                cityId: params.cityId,
                name: params.salerName,
                email: params.salerEmali,
                type: 2 // 运营负责人
            }
        }];

        combine(request, function (data) {
            if (data.length === 2) {
                if (data[0].code === 200 && data[1].code === 200) {
                    fn(data[0]);
                } else {
                    fn(data[0]);
                }
            }
        });
    },
    // 获取城市销售/运营负责人
    getCityPrincipal(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/getCityPrincipal`,
            method: 'POST',
            params: {
                cityId: params.cityId,
                type: 1 // 运营负责人
            }
        }, {
            url: `${domain}adEstateIndices/getCityPrincipal`,
            method: 'POST',
            params: {
                cityId: params.cityId,
                type: 2 // 运营负责人
            }
        }];

        combine(request, function (data) {
            if (data.length === 2) {
                if (data[0].code === 200 && data[1].code === 200) {
                    fn({
                        code: 200,
                        data: {
                            operatorName: data[0].data.name,
                            operatorEmali: data[0].data.email,
                            salerName: data[1].data.name,
                            salerEmali: data[1].data.email
                        },
                        msg: 'success'
                    });
                } else {
                    fn({
                        code: 500,
                        msg: 'server error'
                    })
                }
            }
        });
    },
    // 获取表格数据
    getTableData(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/details`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 设置基本数据
    setBasicData(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/setBasicData`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 更新和插入数据
    insertUpdateData(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/update`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 设定职位信息
    setPositionInfo(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/setPositionInfo`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 更新职位信息
    updatePositionInfo(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/updatePositionInfo`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 通过楼盘id获取楼盘名称
    getEstateInfoById(params, fn) {
        let request = [{
            url: `${domain}adEstateIndices/getEstateInfoById`,
            method: 'POST',
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    }
};