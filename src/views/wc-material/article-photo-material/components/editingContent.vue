<template>
    <li>
        <div class="comp-top-level"
             v-html="innerText"
             @focus="isLocked = true"
             @blur="focusBlur"
             @keyup="changeText"
             @click="handleClick(false)"
        >
        </div>
    </li>

    <!--TODO contenteditable会造成IE下 visibility 冲突-->
    <!--:contenteditable="canEdit"-->



</template>
<script type="text/ecmascript-6">
    export default {
        name: 'editiongContent',
        props: {
            value: {
                type: String,
                default: ''
            },
            canEdit: {
                type: Boolean,
                default: true
            },
            index:null
        },
        data() {
            return {
                innerText: this.value,
                isLocked: false,
                focusEle: ''
            }
        },
        mounted(){
            this.initAttachEvent()
        },
        watch: {
            'value'() {
                if (!this.isLocked || !this.innerText) {
                    this.innerText = this.value;
                    let self = this;
                    setTimeout(()=>{self.initAttachEvent()},200)
                }
            }
        },
        methods: {
            changeText() {
//                console.log("changeText")
//                console.log(this.$el.innerHTML)
                this.$emit('input', this.$el.children[0].innerHTML);
//                this.handleClick(true)
            },
            handleClick(focus){
                let cellArr = []
                if(focus){
                    let cellStr = $(this.focusEle).attr("cell-type")
                    cellArr = cellStr.split(" ")
                }
                this.$emit('focus', {
                    element: focus ? this.focusEle : this.$el.children[0].children,
                    index:this.index,
                    ref:this,
                    cellType: cellArr
                })
            },
            clearFocus(){
                this.focusEle = ''
            },
            focusBlur(){
                this.isLocked = false;
//                console.log("失去焦点")
            },
            initAttachEvent(){
                let contentTxt = $(this.$el).find($("[cell-type]"))
//                contentTxt.attr("contenteditable",true)
                let self = this
                contentTxt.each((n, v)=>{
                    $(v).click((e)=>{

                        self.focusEle = v
                        self.handleClick(true)
                        e.stopPropagation()
                    })
                })
//                console.log(contentTxt)
            },
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    .comp-top-level {
        user-select: text;
        user-select: element;
        outline: none;
        width: 100%;
            cursor: pointer;
        &:hover {
            -webkit-outline: 1px dashed #eb6526;
            -moz-outline: 1px dashed #eb6526;
            -ms-outline: 1px dashed #eb6526;
            -o-outline: 1px dashed #eb6526;
            outline: #eb6526 dashed 1px;
        }
        [contenteditable=true] {
            -webkit-user-modify: read-write-plaintext-only;
            user-modify: read-write;
            &:empty:before {
                content: attr(placeholder);
                display: block;
                color: #ccc;
            }
        }
    }

</style>