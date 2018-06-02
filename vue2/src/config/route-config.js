/**
 * Created by leijia206223 on 2016/10/27.
 */
//import store from 'store'
//定义路由如下
const City = resolve => {
    require.ensure(['../components/city/city.vue'], () => {
        resolve(require('../components/city/city.vue'));
    });
};
const CityDetail = resolve => {
    require.ensure(['../components/city-detail/city-detail.vue'], () => {
        resolve(require('../components/city-detail/city-detail.vue'));
    });
};
const CityCpm = resolve => {
    require.ensure(['../components/city-cpm/city-cpm.vue'], () => {
        resolve(require('../components/city-cpm/city-cpm.vue'));
    });
};
const Ad = resolve => {
    require.ensure(['../components/ad/ad.vue'], () => {
        resolve(require('../components/ad/ad.vue'));
    });
};
const AdDetail = resolve => {
    require.ensure(['../components/ad-detail/ad-detail.vue'], () => {
        resolve(require('../components/ad-detail/ad-detail.vue'));
    });
};
const AdRelease = resolve => {
    require.ensure(['../components/ad-release/ad-release.vue'], () => {
        resolve(require('../components/ad-release/ad-release.vue'));
    });
};
const AdHistory = resolve => {
    require.ensure(['../components/ad-history/ad-history.vue'], () => {
        resolve(require('../components/ad-history/ad-history.vue'));
    });
};
const AdHistoryAnonymity = resolve => {
    require.ensure(['../components/ad-history-anonymity/ad-history-anonymity.vue'], () => {
        resolve(require('../components/ad-history-anonymity/ad-history-anonymity.vue'));
    });
};
const AdSchedule = resolve => {
    require.ensure(['../components/ad-schedule/ad-schedule.vue'], () => {
        resolve(require('../components/ad-schedule/ad-schedule.vue'));
    });
};
const Performance = resolve => {
    require.ensure(['../components/performance/performance.vue'], () => {
        resolve(require('../components/performance/performance.vue'));
    });
};
const PerformanceDetail = resolve => {
    require.ensure(['../components/performance-detail/performance-detail.vue'], () => {
        resolve(require('../components/performance-detail/performance-detail.vue'));
    });
};
const Notice = resolve => {
    require.ensure(['../components/notice/notice.vue'], () => {
        resolve(require('../components/notice/notice.vue'));
    });
};
const Message = resolve => {
    require.ensure(['../components/message/message.vue'], () => {
        resolve(require('../components/message/message.vue'));
    });
};
const Customer = resolve => {
    require.ensure(['../components/customer/customer.vue'], () => {
        resolve(require('../components/customer/customer.vue'));
    });
};
const CustomerDetail = resolve => {
    require.ensure(['../components/customer-detail/customer-detail.vue'], () => {
        resolve(require('../components/customer-detail/customer-detail.vue'));
    });
};
const CustomerAgent = resolve => {
    require.ensure(['../components/customer-agent/customer-agent.vue'], () => {
        resolve(require('../components/customer-agent/customer-agent.vue'));
    })
};
const CustomerAgentDetail = resolve => {
    require.ensure(['../components/customer-agent-detail/expend-detail.vue'], () => {
        resolve(require('../components/customer-agent-detail/expend-detail.vue'));
    })
};
const AdList = resolve => {
    require.ensure(['../components/ad-list/ad-list.vue'], () => {
        resolve(require('../components/ad-list/ad-list.vue'));
    })
};
const Account = resolve => {
    require.ensure(['../components/audit-account/audit-account.vue'], () => {
        resolve(require('../components/audit-account/audit-account.vue'));
    });
};
const Estate = resolve => {
    require.ensure(['../components/audit-estate/audit-estate.vue'], () => {
        resolve(require('../components/audit-estate/audit-estate.vue'));
    });
};
const Order = resolve => {
    require.ensure(['../components/audit-order/audit-order.vue'], () => {
        resolve(require('../components/audit-order/audit-order.vue'));
    });
};
const Taxpayer = resolve => {
    require.ensure(['../components/audit-taxpayer/audit-taxpayer.vue'], () => {
        resolve(require('../components/audit-taxpayer/audit-taxpayer.vue'));
    });
};
const AuditInvoice = resolve => {
    require.ensure(['../components/audit-invoice/audit-invoice.vue'], () => {
        resolve(require('../components/audit-invoice/audit-invoice.vue'));
    });
};
const DownloadReport = resolve => {
    require.ensure(['../components/download-report/download-report.vue'], () => {
        resolve(require('../components/download-report/download-report.vue'));
    });
}
const Operation = resolve => {
    require.ensure(['../components/operation/operation.vue'], () => {
        resolve(require('../components/operation/operation.vue'));
    });
};
const Management = resolve => {
    require.ensure(['../components/management/management.vue'], () => {
        resolve(require('../components/management/management.vue'));
    });
};

const AdUpload = resolve => {
    require.ensure(['../components/ad-upload/ad-upload.vue'], () => {
        resolve(require('../components/ad-upload/ad-upload.vue'));
    });
};

const Recharge = resolve => {
    require.ensure(['../components/recharge/recharge.vue'], () => {
        resolve(require('../components/recharge/recharge.vue'));
    });
};

const DiscountPolicy = resolve => {
    require.ensure(['../components/discount-policy/discount-policy.vue'], () => {
        resolve(require('../components/discount-policy/discount-policy.vue'));
    });
};

const WhiteList = resolve => {
    require.ensure(['../components/whiteList/whiteList.vue'], () => {
        resolve(require('../components/whiteList/whiteList.vue'));
    });
};

const ChargeReview = resolve => {
    require.ensure(['../components/charge-review/charge-review.vue'], () => {
        resolve(require('../components/charge-review/charge-review.vue'));
    });
};

const adRedPacket = resolve => {
    require.ensure(['../components/ad-redPacket/ad-redPacket.vue'], () => {
        resolve(require('../components/ad-redPacket/ad-redPacket.vue'));
    });
};

const redPacketUser = resolve => {
    require.ensure(['../components/redPacketUser/redPacketUser.vue'], () => {
        resolve(require('../components/redPacketUser/redPacketUser.vue'));
    });
};

const DbOperation = resolve => {
    require.ensure(['../components/db-operation/db-operation.vue'], () => {
        resolve(require('../components/db-operation/db-operation.vue'));
    });
};
//如下
const routers = [{
        path: '/',
        name: 'index',
        component: City
    },
    {
        path: '/city',
        name: 'city',
        component: City
    },
    {
        path: '/city-detail',
        name: 'city-detail',
        component: CityDetail
    },
    {
        path: '/city-cpm',
        name: 'city-cpm',
        component: CityCpm
    },
    {
        path: '/ad',
        name: 'ad',
        component: Ad
    },
    {
        path: '/ad-detail',
        name: 'ad-detail',
        component: AdDetail
    },
    {
        path: '/ad-release',
        name: 'ad-release',
        component: AdRelease
    },
    {
        path: '/ad-schedule',
        name: 'ad-schedule',
        component: AdSchedule
    },
    {
        path: '/ad-upload',
        name: 'ad-upload',
        component: AdUpload
    },
    {
        path: '/performance',
        name: 'performance',
        component: Performance
    },
    {
        path: '/performance-detail',
        name: 'performance-detail',
        component: PerformanceDetail
    },
    {
        path: '/ad-history',
        name: 'ad-history',
        component: AdHistory
    },
    {
        path: '/ad-history-anonymity',
        name: 'ad-history-anonymity',
        component: AdHistoryAnonymity
    },
    {
        path: '/customer',
        name: 'customer',
        component: Customer
    },
    {
        path: '/customer_agent',
        name: 'customer_agent',
        component: CustomerAgent
    },
    {
        path: '/customer-agent-detail',
        name: 'customer-agent-detail',
        component: CustomerAgentDetail
    },
    {
        path: '/ad-list',
        name: 'ad-list',
        component: AdList
    },
    {
        path: '/customer-detail',
        name: 'customerDetail',
        component: CustomerDetail
    },
    {
        path: '/notice',
        name: 'notice',
        component: Notice
    },
    {
        path: '/message',
        name: 'message',
        component: Message
    },
    {
        path: '/audit-account',
        name: 'account',
        component: Account
    },
    {
        path: '/audit-estate',
        name: 'estate',
        component: Estate
    },
    {
        path: '/audit-order',
        name: 'order',
        component: Order
    },
    {
        path: '/audit-taxpayer',
        name: 'audit-taxpayer',
        component: Taxpayer
    },
    {
        path: '/audit-invoice',
        name: 'audit-invoice',
        component: AuditInvoice
    },
    {
        path: '/download-report',
        name: 'download-report',
        component: DownloadReport
    },
    {
        path: '/operation',
        name: 'operation',
        component: Operation
    },
    {
        path: '/management',
        name: 'management',
        component: Management
    },
    {
        path: '/recharge',
        name: 'recharge',
        component: Recharge
    },
    {
        path: '/discount-policy',
        name: 'discount-policy',
        component: DiscountPolicy
    },
    {
        path: '/whiteList',
        name: 'whiteList',
        component: WhiteList
    },
    {
        path: '/charge-review',
        name: 'charge-review',
        component: ChargeReview
    },
    {
        path: '/ad-redPacket',
        name: 'ad-redPacket',
        component: adRedPacket
    },
    {
        path: '/redPacketUser',
        name: 'redPacketUser',
        component: redPacketUser
    },
    {
        path: '/db-operation',
        name: 'db-operation',
        component: DbOperation
    },
    {
        path: '*',
        component: City
    }
];

export default routers;
