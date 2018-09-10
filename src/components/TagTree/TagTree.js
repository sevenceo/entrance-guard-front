import moment from 'moment';

export default {
    created() {
    },
    mounted() {
        document.body.appendChild(this.$refs.treeDialog.$el);
    },
    props:['treeData','tags'],
    watch: {
        /**
         *  过滤树
         */
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    data(){
        return {
            labelTreeVisible:false,
            chooseChecked:[],
            filterText: '',
            treeTags:[],
            defaultExpand:[],
            defaultProps: {
                children: 'childTags',
                label: 'name',
                disabled: function(data,node){
                    let nowDate = new Date(moment(new Date()).format("YYYY-MM-DD"));
                    let validateEnd1 = new Date(moment(data.validateEnd).format("YYYY-MM-DD"));
                    let validateStart1 = new Date(moment(data.validateStart).format("YYYY-MM-DD"));
                    let flag = nowDate < validateStart1 || nowDate > validateEnd1;
                    return (data.category !="HAND" || data.state == "OFF" || flag);
                }
             }
        }
    },
    methods: {
        showLabelTree: function() {
            this.initParam();
            this.labelTreeVisible = true;
            this.treeTags =  $.extend({},this.tags);
            for(let i in this.treeTags){
                this.treeTags[i].name = this.treeTags[i].tagName;
                this.treeTags[i].id = this.treeTags[i].tagId;
                this.chooseChecked.push(this.treeTags[i].tagId);
            }
            this.setDefaultExpandTreeId(this.treeData);
            this.setCheckedKeys();
        },
        setDefaultExpandTreeId(tree){
          if(tree != null){
              for(let i in tree){
                  if(tree[i].category == 'HAND'){
                      this.defaultExpand.push(tree[i].id);
                  }
                  this.setDefaultExpandTreeId(tree[i].childTags);
              }
          }else{
              return;
          }

        },
        setCheckedKeys() {
            if(this.$refs.tree){
                this.$refs.tree.setCheckedKeys(this.chooseChecked);
            }
        },
        closeTree: function() {
            this.labelTreeVisible = false;
        },
        cancel: function() {
            this.labelTreeVisible = false;
        },
        getCheckedNodes: function() {
            this.labelTreeVisible = false;
            this.treeTags = $.extend([],this.filterSelectedTags(this.$refs.tree.getCheckedNodes()));
            this.$emit('treeTags',this.treeTags)
        },
        setCheckedNodes: function() {
            if(this.$refs.tree) {
                this.$refs.tree.setCheckedNodes(this.treeTags);
            }
        },
        resetChecked: function() {
            if(this.$refs.tree) {
                this.$refs.tree.setCheckedKeys([]);
            }
        },
        handleClose: function(tag) {
            this.treeTags.splice(this.treeTags.indexOf(tag),1);
            this.setCheckedNodes();
        },
        filterSelectedTags: function(list) {
            let array = [];
            for(let i = 0; i < list.length; i++) {
                if(list[i].format != '分类') {
                    array.push(list[i]);
                }
            }
            return array;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        initParam(){
            this.defaultExpand = [];
            this.chooseChecked = [];
            this.filterText = '';
            this.treeTags = [];
        }
    }
}