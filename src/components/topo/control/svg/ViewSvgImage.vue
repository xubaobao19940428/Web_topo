<template>
<embed :src="svgURL" :width="detail.style.position.w" :height="detail.style.position.h" style="pointer-events: none;"
type="image/svg+xml"
pluginspage="http://www.adobe.com/svg/viewer/install/" />
<!-- <iframe :src="svgURL" :width="detail.style.position.w" :height="detail.style.position.h" >
</iframe> -->
<!-- <svg-icon :icon-class="svgName" :width="detail.style.position.w" :height="detail.style.position.h" style="pointer-events: none;">

</svg-icon> -->
</template>

<script>
import svgView from './ViewSvg';

export default {
    name: 'ViewSvgImage',
    extends: svgView,
    methods: {        
        onResize() {
            
        }
    },
    mounted() {
        console.log(this.svgURL)
        this.onResize();
    }
}
</script>
