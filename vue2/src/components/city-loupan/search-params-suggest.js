import $$model_cityLoupan from "./model/city-loupan.js";

export default {
    data: {
        estateOption: [],
        estateOptionLoading: false,
        companyOption: [],
        companyOptionLoading: false,
        estatePrincipalNameOption: [],
        estatePrincipalNameLoading: false,
        estateSalesNameOption: [],
        estateSalesNameLoading: false
    },
    methods: {
        getLoupanSuggest (query) {
            if (query !== "") {
                this.estateOptionLoading = true;
                $$model_cityLoupan.getLoupanSuggest({ cityId: this.ruleForm.cityId, queryWord: query }, res => {
                    this.estateOptionLoading = false;
                    if (res.code === 200) {
                        this.estateOption = res.data;
                    } else {
                        this.$message.error(res.msg || "server error");
                    }
                });
            } else {
                this.estateOption = [];
            }
        },
        getCompanySuggest (query) {
            if (query !== "") {
                this.companyOptionLoading = true;
                $$model_cityLoupan.getCompanyList({ name: query }, res => {
                    this.companyOptionLoading = false;
                    if (res.code === 200) {
                        this.companyOption = res.data;
                    } else {
                        this.$message.error(res.msg || "server error");
                    }
                });
            } else {
                this.estateOption = [];
            }
        },
        getPrincipalNameSuggest (query) {
            if (query !== "") {
                this.estatePrincipalNameLoading = true;
                $$model_cityLoupan.getBusinesseLeaderList({ cityId: this.ruleForm.cityId, name: query }, res => {
                    this.estatePrincipalNameLoading = false;
                    if (res.code === 200) {
                        this.estatePrincipalNameOption = res.data;
                    } else {
                        this.$message.error(res.msg || "server error");
                    }
                });
            } else {
                this.estatePrincipalNameOption = [];
            }
        },
        getSalesNameSuggest (query) {
            if (query !== "") {
                this.estateSalesNameLoading = true;
                $$model_cityLoupan.getSalesLeaderList({ cityId: this.ruleForm.cityId, name: query }, res => {
                    this.estateSalesNameLoading = false;
                    if (res.code === 200) {
                        this.estateSalesNameOption = res.data;
                    } else {
                        this.$message.error(res.msg || "server error");
                    }
                });
            } else {
                this.estateSalesNameOption = [];
            }
        }
    }
};
