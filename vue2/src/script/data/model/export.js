import $$operationModel from './operation';
import $$invoiceModel from './invoice';
import $$audit from './audit';
import $$ad from './ad';
import $$message from './message';
import $$city from './city';
import $$performance from './performance';
import $$customer from './customer';

export default {
	'operation': {
		model: $$operationModel,
		action: 'getOperationList'
	},
	'qualification': {
		model: $$invoiceModel,
		action: 'getTaxpayer'
	},
	'audit-invoice': {
		model: $$invoiceModel,
		action: 'getInvoices'
	},
	'audit-account': {
		model: $$audit,
		type: 'account',
		action: 'getAudit'
	},
	'audit-building': {
		model: $$audit,
		type: 'estate',
		action: 'getAudit'
	},
	'audit-idea': {
		model: $$audit,
		type: 'order',
		action: 'getAudit'
	},
	'ad': {
		model: $$ad,
		action: 'getAdInfo'
	},
	"ad-detail": {
		model: $$ad,
		action: 'getAdDetail'
	},
	"ad-release": {
		model: $$ad,
		action: 'getReleaseInfo'
	},
	"performance": {
		model: $$performance,
		action: 'getPerformance'
	},
    "performance-detail": {
		model: $$performance,
		action: 'getPerformanceDetail'
	},
	'city': {
		model: $$city,
		action: 'getCityStaistics'
	},
	'city-detail': {
		model: $$city,
		action: 'getCityDetailStaistics'
	},
	'message': {
		model: $$message,
		action: 'getMsgList'
	},
	'customer': {
		model: $$customer,
		action: 'getCustomerList'
	}
}
