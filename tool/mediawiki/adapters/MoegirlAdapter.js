import BaseAdapter from './BaseAdapter.js'

export default class MoegirlAdapter extends BaseAdapter {
    get baseApi() {
        return 'https://zh.moegirl.org.cn/api.php'
    }
    get name() {
        return "萌娘百科"
    }
}