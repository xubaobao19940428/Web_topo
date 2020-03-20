<template>
<embed :src="svgURL" :width="detail.style.position.w" :height="detail.style.position.h" style="pointer-events: none;"
type="image/svg+xml"
pluginspage="http://www.adobe.com/svg/viewer/install/" />

</template>

<script>
import svgView from './ViewSvg';

export default {
    name: 'ViewSvgStatic',
    extends: svgView,
    data(){
        return  {
            svgContent: ''
        }
    },
    methods: {   
        loadData() {
            var that = this;
            this.$axios.get(this.svgURL)
            .then(function (response) {
                console.log(response);                
                that.svgContent = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        },  
        onResize() {
            
        }
    },
    mounted() {
        this.loadData();
    }
}
</script>
