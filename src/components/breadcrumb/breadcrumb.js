/**
 * Created by Micheal Xiao on 2017/6/2.
 */
export default {
    created() {
        this.getBreadcrumb()
    },
    data() {
        return {
            levelList: null
        }
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.meta.name);
            const first = matched[0];
            if (first && (first.meta.name !== '首页' || first.path !== '')) {
                matched = [{ name: '首页', path: '/' }].concat(matched)
            }
            this.levelList = matched;
            // console.log("面包屑导航数据")
            // console.log(this.levelList)
        }
    },
    watch: {
        $route() {
            this.getBreadcrumb();
        }
    }
}