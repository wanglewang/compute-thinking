<template>
    <div  class="prism-player" id="J_prismPlayer"></div>
</template>

<script>
    export default {
        name: "AliPlayer",
        props:{
            videoId:'',
            playAuth:''
        },
        mounted() {
            let player = new Aliplayer(
                {
                    id: 'J_prismPlayer',
                    width: '100%',
                    height: '480px',
                    autoplay: false,
                    cover: 'http://liveroom-img.oss-cn-qingdao.aliyuncs.com/logo.png',
                    //播放配置
                    vid : this.videoId,
                    playauth : this.playAuth,
                    encryptType:1, //当播放私有加密流时需要设置。
                },
                function(player) {
                    console.log('播放器创建好了。')
                }
            );
        }
    }
</script>

<style scoped>
</style>
