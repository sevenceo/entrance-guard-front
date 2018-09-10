<template>
    <transition name="el-zoom-in-top" @after-leave="doDestroy">
        <div
                v-show="showPopper"
                class="el-autocomplete-suggestion el-popper"
                :class="{ 'is-loading': parent.loading }"
                :style="{ width: dropdownWidth }"
                role="region"
        >
            <el-scrollbar
                    tag="ul"
                    wrap-class="el-autocomplete-suggestion__wrap"
                    view-class="el-autocomplete-suggestion__list"
            >
                <!--<li v-if="parent.loading"><i class="el-icon-loading"></i></li>-->
                <!--<div v-else>-->
                    <el-tree show-checkbox :data="data" :props="props"
                             default-expand-all></el-tree>
                <!--</div>-->
            </el-scrollbar>
        </div>
    </transition>
</template>
<script>
    import Popper from 'element-ui/src/utils/vue-popper';
    import Emitter from 'element-ui/src/mixins/emitter';
    // import ElScrollbar from 'element-ui/packages/scrollbar';
    export default {
        // components: { ElScrollbar },
        mixins: [Popper, Emitter],
        componentName: 'HsDroptreeSuggestions',
        data() {
            return {
                parent: this.$parent,
                dropdownWidth: ''
            };
        },
        props: {
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
        methods: {
            select(item) {
                this.dispatch('HsDroptree', 'item-click', item);
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