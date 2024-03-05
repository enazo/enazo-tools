import BaseAdapter from './BaseAdapter.js'

export default class HuijiAdapter extends BaseAdapter {
    get baseApi() {
        return 'https://asoiaf.huijiwiki.com/api.php'
    }
    get name() {
        return "灰机WIKI"
    }
}