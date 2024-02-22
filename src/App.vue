<template>

<el-card class="box-card" v-for="post in posts" :key="post.id">
  <template #header>
    <div>
      <span>{{ post.title }}</span>
    </div>
  </template>
  <div>{{ post.body }}</div>
</el-card>

</template>

<script setup>
import { onMounted, ref } from "vue";

onMounted(() => {
  firstStage()
});

let posts = ref({});

async function firstStage(){
  fetch('https://jsonplaceholder.typicode.com/posts')
  .then((response) => response.json())
  .then((json) => posts.value = json);
}

</script>

<style scoped>
  .box-card {
    width: 480px;
  }
</style>
