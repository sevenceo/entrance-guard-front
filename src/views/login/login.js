/**
 * Created by Micheal Xiao on 2017/9/11.
 */
import {mapGetters} from 'vuex';
import {isWscnEmail} from 'utils/validate';
import socialSign from './socialsignin';
import {GetAccountInfo} from '../../api/login'
import changeAccount from '../../components/changeAccount/changeAccount.vue';
import Cookies from 'js-cookie';
import {Message} from 'element-ui';
import store from '../../store';

export default {
    components: {
        socialSign, changeAccount
    },
    name: 'login',
    data() {
        const validatePass = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码不能小于6位'));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: Cookies.get('username'),
                password: Cookies.get('password')
            },
            loginRules: {
                username: [
                    {required: true, trigger: 'blur'}
                ],
                password: [
                    {required: true, trigger: 'blur', validator: validatePass}
                ]
            },
            loading: false,
            showDialog: false,
            showAccountDialog: false,
            rememberPwd: Cookies.get('rememberPwd') ? Cookies.get('rememberPwd') : false,
            showHypersmart:false,
            showLandingnext:false
        }
    },
    computed: {
        ...mapGetters([
            'auth_type'
        ])
    },
    methods: {
        handleLogin() {
            const _this = this;
            this.loading = false;
            this.$store.dispatch('LoginByEmail', this.loginForm).then(
                (data) => {
                    _this.loading = true;
                    this.$router.push({path: '/guard/human'});    // 登陸成功，展示控制設備頁面

                }
            ).catch(err => {
                    Message({
                        message: err.message,
                        type: 'error',
                        duration: 10 * 1000,
                        showClose: true,
                        customClass: 'msg-error',
                        iconClass: 'sc'
                    })
                    this.loading = false;
                }
            )
        }
    },
    created() {
        // window.addEventListener('hashchange', this.afterQRScan);

        // 初始化logo
        let host2 = document.domain;
        //获取域名
        //获取页面完整地址
        /*let host = window.location.host;
        let url = window.location.href;*/

        if (host2) {
            if (host2.indexOf("hypersmart") > -1) {
                this.showHypersmart = true;
                this.showLandingnext = false;
            }
            if (host2.indexOf("ldnext") > -1) {
                this.showHypersmart = false;
                this.showLandingnext = true;
            }
        }
    }
    ,
    destroyed() {
        // window.removeEventListener('hashchange', this.afterQRScan);
    }
}