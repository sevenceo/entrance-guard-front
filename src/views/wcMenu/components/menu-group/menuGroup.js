/**
 * Created by Micheal Xiao on 2017/8/7.
 */
import store from "store"
import { ValWcMenuName, validateURL } from "utils/validate"

export default {
    props: [
        'menuData', 'group'
    ],
    created(){
        // console.log(this.group)
    },
    data(){
        var validateUrl = (rule, value, callback) => {
            var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的网址'));
            }
        };
        return {
            textMap: {
                update: '编辑',
                create: '创建'
            },
            dialogStatus: 'create',
            dialogFormVisible: false,
            dialogWarnVisible: false,
            temp: tempInit(),
            allBtnTypeOpt: [{
                value: 'click',
                label: '点击事件'
            }, {
                value: 'view',
                label: '跳转链接'
            }, {
                value: 'navigation',
                label: '导航按钮'
            }],
            nomalBtnOpt: [{
                value: 'click',
                label: '点击事件'
            }, {
                value: 'view',
                label: '跳转链接'
            }],
            jumpMode :[
                {value: 'directly',
                    label: '直接跳转'
                },
                {value: 'proxy',
                    label: '代理跳转'
                }
            ],
            eventMode :[
                // {value: 'systemEventKey',
                //     label: '推送素材'
                // },
                {value: 'customevent',
                    label: '自定义事件'
                }
            ],
            rules:{
                text: [
                    { required: true, trigger: 'blur',message:'请输入名称，名称不能为纯空格' },
                    { validator: ValWcMenuName, trigger: 'blur' }
                ],
                targetUrl:[{
                    required: true, message: '请填写网址'
                },{
                    validator: validateURL, trigger:'blur'
                }],
                customEventKey:[{
                    required: true, message: '请填写ID'
                }]
            },
            clickIndex : '',

            isNavigation: false
        }
    },
    methods: {
        resetForm() {
            let self = this
            setTimeout(()=>{
                self.$refs['temp'].resetFields();
            },200)
            // this.temp = tempInit();
        },
        handleButtonClick(button, index, subbutton){
            // this.$refs["form"].resetFields()
            this.temp = tempInit()
            this.clickIndex = index
            if (this.menuData.slice(5,6)[0].buttonType === "navigation" || index === 5 || subbutton) {

                if (button.buttonType) {
                    this.dialogStatus = 'update';
                } else {
                    this.dialogStatus = 'create';
                    this.temp = tempInit()
                }
                this.dialogFormVisible = true;
                $.extend(this.temp, button)
                this.temp.index = index;
                this.temp.group = this.group;
            } else {
                this.dialogWarnVisible = true
                this.ConfirmBox('当前操作，只有一级菜单按钮为导航类型时可执行')
            }
            // this.temp = tempInit()// 临时测试
            let _showIndex = this.temp.group - 1;
            this.$store.commit('SET_SHOW_INDEX', _showIndex)
        },
        checkButtonClick(index,buttontype){

        },
        closeDialog(){
            this.dialogFormVisible = false;
            this.temp = tempInit()
        },
        closeWarnDialog(){
            this.dialogWarnVisible = false;
        },
        handleClose(temp){
            this.closeDialog()
            // this.$refs[temp].resetFields();

        },
        update(temp){
            console.log(this.temp)
            this.$refs[temp].validate((valid) => {
                if (valid) {
                    this.onXHR = true

                    if ( this.clickIndex === 5 ){
                        if(this.temp.buttonType === "click" || this.temp.buttonType === "view"){
                            this.$store.commit('CLEAN_MENU_GROUP', this.group)
                        }
                    }
                    this.$store.commit('SET_MENU_BUTTON', this.temp)
                    this.closeDialog()
                    // this.$refs[temp].resetFields();

                } else {
                    return false;
                }
            });

        },
        handleClean(){
            this.$store.commit('CLEAN_MENU_GROUP', this.group)
            this.closeDialog()
        },
        handleChildrenClean(){
            this.$store.commit('CLEAN_MENU_BUTTON', this.temp)
            this.closeDialog()
        }
    }

}

function tempInit() {
    return {
        buttonType: "",
        clickType: "customevent",
        customEventKey: "",
        isEnable: true,
        fullName: "",
        text: "",
        useFilter: false,
        viewType: "directly",
        systemEventKey: Math.random().toString(36).substr(2)
    }
}

function tempNavInit(){
    return{
        buttonType:"navigation",
        clickType:"customevent",
        isEnable:true,
        fullName:"",
        text:"",
        useFilter:false,
        viewType:"directly",
        systemEventKey: Math.random().toString(36).substr(2)
    }
}

