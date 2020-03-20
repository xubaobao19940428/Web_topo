<template>
  <div class="player">
    <div style="float: left;width: 550px;">
		直播
		<ali-player 
    @play="play($event)"
		:useFlashPrism="true" 
		:autoplay="true" 
		:isLive="true" 
		:rePlay="false"
		:showBuffer="true"
		showBarTime="5000"
		width="500px" 
		height="400px" 
		controlBarVisibility="hover"
		:source='url' ></ali-player>
    </div>
   </div>
</template>
<script>
// import SWF_URL from 'videojs-swf/dist/video.js-swf'
import aliplayer from "@/components/livePlay/index.vue";
export default {
  components: {
    'ali-player': aliplayer
  },
  data() {
    return {
      url:'http://1011.hlsplay.aodianyun.com/demo/game.flv'
    };
  },
  methods: {
     play(event) {
      console.log(event);
    },
  },
  computed: {
  },
  mounted() {
      
  },
};
</script>
<style scoped>
.player {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
</style>