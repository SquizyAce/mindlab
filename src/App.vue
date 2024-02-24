<template>
<div class="floatBtn">
  <el-button size="large" circle type="primary" @click="addPost">+</el-button>
</div>
<el-card class="box-card" v-for="post in posts" :key="post.id">
  <template #header>
    <div class="card-header">
      <span v-if="!post.isEdit">{{ post.title }}</span>
      <el-input v-else v-model="post.title"></el-input>
      <div class="header-actions">
        <el-icon 
          :class="post.isEdit? 'mdi mdi-content-save' : 'mdi mdi-pen'" 
          @click="post.isEdit? updateAndCreatePost(post) : post.isEdit = true"
          ></el-icon>
        <el-icon class="mdi mdi-trash-can" @click="deletePost(post.id)"></el-icon>
      </div>
    </div>
  </template>
  <div v-if="!post.isEdit">{{ post.body }}</div>
  <el-input v-else type="textarea" v-model="post.body" rows="4"></el-input>
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
  .then((json) => posts.value = json.map(elem => {
    elem.isEdit = false
    return elem
  }));
}

function addPost(){
  posts.value.push({
    id: '',
    title: '',
    body: '',
    userId: 1,
    isEdit: true,
    isNew: true
  })
  scrollBy({ top: window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight), behavior: 'smooth' });
}

function updateAndCreatePost(post){
  let
    url = post.isNew? '' : '/'+post.id,
    body = JSON.stringify({
      title: post.title,
      body: post.body,
      userId: post.userId,
      id: post.isNew? '' : post.id
    }),
    method = post.isNew? 'POST' : 'PUT'

    fetch('https://jsonplaceholder.typicode.com/posts' + url, {
      method: method,
      body: body,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((json) => {
      json.isEdit = false
      Object.assign(post, json)
    }); 
}

function deletePost(id){
  fetch('https://jsonplaceholder.typicode.com/posts/'+id, {
    method: 'DELETE',
  })
  .then((response) => {
    // firstStage()  
    let index = posts.value.findIndex(i => i.id == id)
    if(index !== false)
    posts.value.splice(index, 1)
    console.log(index, id)
  })
  
}

</script>

<style scoped>
  .box-card {
    width: 480px;
  }
  .floatBtn{
    position: fixed;
    bottom:40px;
	  right:40px;
  }
  .card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-actions{
    display: flex;
    gap: 10px;
  }
  .el-icon{
    cursor: pointer;
  }
</style>
