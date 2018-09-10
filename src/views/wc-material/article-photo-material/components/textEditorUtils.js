/**
 * Created by Micheal Xiao on 2017/10/19.
 */
export Bold = {
    // 点击事件
    onClick: function onClick(e) {
        // 点击菜单将触发这里

        // var editor = this.editor;
        // var isSeleEmpty = editor.selection.isSelectionEmpty();
        var selection = window.getSelection();
        if (selection.rangeCount === 0) {
            // 选区是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange();
        }

        // 执行 bold 命令
        editor.cmd.do('bold');

        if (isSeleEmpty) {
            // 需要将选取折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    },
}

function isSelectionEmpty() {
    var range = this._currentRange;
    if (range && range.startContainer) {
        if (range.startContainer === range.endContainer) {
            if (range.startOffset === range.endOffset) {
                return true;
            }
        }
    }
    return false;
}