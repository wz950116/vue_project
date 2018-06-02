import $$model_cityLoupan from '../model/city-loupan.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

export default {
    name: 'add-sales-info',
    props: {
        cityId: Number,
        cityName: String
    },
    data() {
        return {
            type: 'sales', // sales: 录入销售信息, operat: 录入运营信息
            dialogVisble: false,
            addGroupDialog: {
                title: '新增分组',
                id: 0,
                addGroupVisble: false,
                addGroupForm: {
                    name: ''
                },
                addGroupRule: {
                    name: [{ required: true, message: '请输入组名', trigger: 'blur' }]
                }
            },
            displayGroupList: [],
            displayMemberList: [],
            addMemberDialog: {
                loading: false,
                groupIdDisable: false,
                emailDisable: false,
                id: 0,
                title: '新增组员',
                addMemberVisble: false,
                addMemberForm: {
                    name: '',
                    email: '',
                    groupId: ''
                },
                addMemberRule: {
                    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
                    groupId: [{ required: true, message: '请选择小组'}]
                }
            }
        }
    },
    computed: {
        title() {
            if (this.type === 'sales') {
                return '录入销售信息';
            } else {
                return '录入运营信息';
            }
        }
    },
    methods: {
        handleAddDialogShow() {
            let addGroupDialog = this.addGroupDialog;
            addGroupDialog.id = 0;
            addGroupDialog.addGroupForm.name = '';
            addGroupDialog.title = '新增分组';
            addGroupDialog.addGroupVisble = true
        },
        handleEditDialogShow(row) {
            let addGroupDialog = this.addGroupDialog;
            addGroupDialog.id = row.id;
            addGroupDialog.addGroupForm.name = row.name;
            addGroupDialog.title = '编辑分组';
            addGroupDialog.addGroupVisble = true;
        },
        handleAddGroup() {
            let addGroupDialog = this.addGroupDialog;
            this.$refs.addGroup.validate(valid => {
                if (valid) {
                    if (addGroupDialog.id > 0) {
                        // 编辑
                        $$model_cityLoupan.updateGroupInfo({name: this.addGroupDialog.addGroupForm.name, groupId: this.addGroupDialog.id}, res => {
                            if (res.code === 200) {
                                location.reload();
                            } else {
                                this.$message.error(res.msg || 'server error');
                            }
                        });
                    } else {
                        // 新增
                        let type = this.type === 'sales' ? 2 : 1;
                        $$model_cityLoupan.insertGroup({cityId: this.cityId, groupName: this.addGroupDialog.addGroupForm.name,type: type}, res => {
                            if (res.code === 200) {
                                location.reload();
                            } else {
                                this.$message.error(res.msg || 'server error');
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        handleDelGroup(id) {
            this.$confirm('是否删除该分组?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $$model_cityLoupan.deleteGroup({groupId: id}, res => {
                    if (res.code === 200) {
                        location.reload();
                    } else {
                        this.$message.error(res.msg || 'server error');
                    }
                });
            }).catch(() => {});
        },
        handelAddMemberDialogShow() {
            let addMemberDialog = this.addMemberDialog;
            let addMemberForm = addMemberDialog.addMemberForm;
            addMemberDialog.id = 0; // 标示为添加组员
            addMemberDialog.groupIdDisable = false;
            addMemberDialog.emailDisable = false;
            addMemberForm.groupId = '';
            addMemberDialog.title = '新增组员';
            addMemberForm.name = '';
            addMemberForm.email = '';
            addMemberForm.groupId = '';
            addMemberDialog.addMemberVisble = true;
        },
        handelEditMemberDialogShow(row) {
            let addMemberDialog = this.addMemberDialog;
            let addMemberForm = addMemberDialog.addMemberForm;
            addMemberDialog.id = 1; // 标示为编辑组员
            addMemberDialog.groupIdDisable = true;
            addMemberDialog.emailDisable = true;
            addMemberForm.groupId = row.groupId;
            addMemberDialog.title = '编辑组员';
            addMemberForm.name = row.name;
            addMemberForm.email = row.email;
            addMemberForm.groupId = row.groupId;
            addMemberDialog.addMemberVisble = true;
        },
        handleAddMember() {
            let addMemberDialog = this.addMemberDialog;
            let addMemberForm = addMemberDialog.addMemberForm;
            this.$refs.addMember.validate(valid => {
                if (valid) {
                    if (addMemberDialog.id) {
                        // 编辑
                        $$model_cityLoupan.updateGroupMemberInfo(addMemberForm, res => {
                            if (res.code === 200) {
                                location.reload();
                            } else {
                                this.$message.error(res.msg || 'server error');
                            }
                        });
                    } else {
                        // 新增
                        $$model_cityLoupan.addGroupMember(addMemberForm, res => {
                            if (res.code === 200) {
                                location.reload();
                            } else {
                                this.$message.error(res.msg || 'server error');
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        handleDelMember(row) {
            this.$confirm('是否删除该组员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $$model_cityLoupan.deleteGroupMember({groupId: row.groupId, email: row.email, type: row.type}, res => {
                    if (res.code === 200) {
                        location.reload();
                    } else {
                        this.$message.error(res.msg || 'server error');
                    }
                });
            }).catch(() => {});
        }
    },
    watch: {
        dialogVisble(val) {
            if (val === true) {
                if (this.type === 'sales') {
                    // 录入销售信息
                    this.displayGroupList = this.$parent.salesGroupList;
                } else {
                    // 录入运营信息d
                    this.displayGroupList = this.$parent.operatingGroupList;
                }
                this.addMemberDialog.loading = true;
                $$model_cityLoupan.getPrincipalNameListByGroupList({groupIdList: _.pluck(this.displayGroupList, 'id')}, res => {
                    this.addMemberDialog.loading = false;
                    if (res.code === 200) {
                        this.displayMemberList = res.data.adEstatePrincipalGroupList;
                    } else {
                        this.$message.error(res.msg || 'server error');
                    }
                });
            }
        }
    }
}