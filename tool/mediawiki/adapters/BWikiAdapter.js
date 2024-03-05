import BaseAdapter from './BaseAdapter.js'

export default class BWikiAdapter extends BaseAdapter {
    get baseApi() {
        return 'https://wiki.biligame.com/wiki/api.php'
    }
    get name() {
        return "BWIKI"
    }
}