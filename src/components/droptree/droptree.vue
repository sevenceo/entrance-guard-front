<template>
    <el-input v-model="val" placeholder="请输入名称" @click="onClick"></el-input>
    <hs-droptree-suggestions :data="data" :props="props"></hs-droptree-suggestions>
</template>
<script>
    // import Popper from 'element-ui/src/utils/vue-popper';
    // import Emitter from 'element-ui/src/mixins/emitter';
    // import ElScrollbar from 'element-ui/packages/scrollbar';
    import HsDroptreeSuggestions from './tree-suggestions.vue'
    export default {
        components: {HsDroptreeSuggestions},
        props: {
            val:{
                type:String,
                default(){
                    return t("");
                }
            },
            data: {
                type: Array
            },
            emptyText: {
                type: String,
                default() {
                    return t('el.tree.emptyText');
                }
            },
            renderAfterExpand: {
                type: Boolean,
                default: true
            },
            fetchData: Function,
            nodeKey: String,
            checkStrictly: Boolean,
            defaultExpandAll: Boolean,
            expandOnClickNode: {
                type: Boolean,
                default: true
            },
            checkDescendants: {
                type: Boolean,
                default: false
            },
            autoExpandParent: {
                type: Boolean,
                default: true
            },
            defaultCheckedKeys: Array,
            defaultExpandedKeys: Array,
            renderContent: Function,
            showCheckbox: {
                type: Boolean,
                default: false
            },
            props: {
                default() {
                    return {
                        children: 'children',
                        label: 'label',
                        icon: 'icon',
                        disabled: 'disabled'
                    };
                }
            },
            lazy: {
                type: Boolean,
                default: false
            },
            highlightCurrent: Boolean,
            load: Function,
            filterNodeMethod: Function,
            accordion: Boolean,
            indent: {
                type: Number,
                default: 18
            }
        },
        //mixins: [Popper, Emitter],
        componentName: 'HsDroptree',
        data() {
            return {
                parent: this.$parent,
                val:"",
                dropdownWidth: ''
            };
        },
        props: {
            options: {
                default() {
                    return {
                        gpuAcceleration: false
                    };
                }
            },
            id: String
        },
        methods: {
            select(item) {
                this.dispatch('Hsdroptree', 'item-click', item);
            },
            onClick(){
                this.fetchData(this.val,(p)=>{
                    console.log(p);
                });
            }
        },
        updated() {
            this.$nextTick(_ => {
                this.updatePopper();
            });
        },
        mounted() {
            this.$parent.popperElm = this.popperElm = this.$el;
            // this.referenceElm = this.$parent.$refs.input.$refs.input;
            // this.referenceList = this.$el.querySelector('.el-autocomplete-suggestion__list');
            // this.referenceList.setAttribute('role', 'listbox');
            // this.referenceList.setAttribute('id', this.id);
        },
        created() {
            this.$on('visible', (val, inputWidth) => {
                this.dropdownWidth = inputWidth + 'px';
                this.showPopper = val;
            });
        }
    };
</script>