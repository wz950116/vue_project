const dealThead = (resData) => {
    const addParent = (data) => {
        if (data.children && data.children.length) {
            data.children.forEach(item => {
                item.parent = data;
                addParent(item);
                item.visible = true;
            });
        }
    };

    // 给每个节点插入默认数据
    resData.forEach(item => {
        item.visible = true;
        addParent(item);
    });

    // 根据key查找节点
    const findNode = (node, value) => {
        let retNode;
        if (node.value === value) {
            return node;
        }
        if (node.children) {
            node.children.forEach(item => {
                if (item.value === value) {
                    retNode = item;
                } else {
                    return findNode(item, value);
                }
            });
        }
        return retNode;
    };

    // 时间筛选有个三个表头需要
    // salesData[销售数据],ecologyInfoData[生态数据],ecologyAdsData[广告数据],
    resData.forEach(item => {
        const salesDataNode = findNode(item, "salesData");
        const ecologyInfoDataNode = findNode(item, "ecologyInfoData");
        const ecologyAdsDataNode = findNode(item, "ecologyAdsData");

        if (salesDataNode) {
            salesDataNode.date = true;
        }

        if (ecologyInfoDataNode) {
            ecologyInfoDataNode.dateRange = true;
        }

        if (ecologyAdsDataNode) {
            ecologyAdsDataNode.date = true;
        }
    });

    return resData;
};

module.exports = dealThead;
