<template>
    <svg class="wscn-icon" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>

</template>

<script>
    export default {
        name: 'wscn-icon-svg',
        props: {
            iconClass: {
                type: String,
                required: true
            }
        },
        computed: {
            iconName() {
                return `#icon-${this.iconClass}`
            }
        }
    }
</script>

<style scoped="" lang="scss">
    .wscn-icon {
        width: 24px;
        height: 18px;
        fill: currentColor;
        margin-top:-1px;
        overflow: hidden;
    }
</style>
