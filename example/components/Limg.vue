<template>
  <div>
    <img v-if="loaded && isImg" :src="img.src" />
    <div v-if="loaded && "></div>
  </div>
</template>

<script>
import imagesLoaded from '../../src/imagesLoadedDirective'

export default {
    name: 'limg',
    props: ['src', 'type'],
    data: {
        loaded: null,
        img: null
    },
    created() {
        this.img = new Image();
        this.img.src = this.src;

        this.img.onload = () => {
            this.loaded = true;
        };

        this.img.onerror = () => {
            this.loaded = false;
        };
    }
}
</script>
<style>
.item {
  background-color: #eee;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  font-family: monospace;
  color: #333;
  border: 2px solid #b6b5b4;
}

.progress-half{
  width: 50%;
  justify-content: space-around;
  margin: 0 auto;
}

.status {
  height: 60px;
  display: flex;
  align-items: center;
}
</style>
