<template>
  <div class="floatBtn">
    <el-button size="large" circle type="primary" @click="addPost">+</el-button>
  </div>
  <el-card class="box-card" v-for="post in posts" :key="post.id">
    <template #header>
      <div class="card-header">
        <span v-if="!post.isEdit">{{ post.title }}</span>
        <div v-else class="card-header-input"> 
          <el-input v-model="post.title" />
          <label>заголовок топика</label>
        </div>      
        <div v-if="!post.sending" class="header-actions">
          <el-icon 
            :class="post.isEdit? 'mdi mdi-content-save' : 'mdi mdi-pen'" 
            @click="post.isEdit? updateAndCreatePost(post) : post.isEdit = true"
          />
          <el-icon 
            class="mdi mdi-trash-can" 
            @click="deletePost(post)" 
          />
        </div>
        <div v-else class="header-actions">
          <el-icon class="mdi mdi-loading" />
        </div>
      </div>
    </template>
  
    <div v-if="!post.isEdit" class="card-body">
      <el-scrollbar height="120px">
        <p class="content">{{post.body}}</p>
      </el-scrollbar>
    </div>
    <div v-else class="card-body">
      <el-input type="textarea" v-model="post.body" rows="5" resize="none"/>
      <label>содержимое топика</label>
    </div>
  </el-card>
  
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import { ElNotification } from 'element-plus'
  
  onMounted(() => {
    firstStage()
  });
  
  let posts = ref({});
  
  async function firstStage(){
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((json) => posts.value = json.map(elem => {
      elem.isEdit = false
      elem.sending = false
      return elem
    }));
  }
  
  function addPost(){
    posts.value.push({
      id:'',
      title: '',
      body: '',
      userId: 1,
      sending:false,
      isEdit: true,
    })
    scrollBy({ top: window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight), behavior: 'smooth' });
  }
  
  async function updateAndCreatePost(post){
    post.sending=true;
    
    let body = JSON.stringify({
      title: post.title,
      body: post.body,
      userId: post.userId,
      id: post.id
    });
    
      let result=await fetch('https://jsonplaceholder.typicode.com/posts/' + post.id, {
          method: post.id==''? 'POST' : 'PUT',
          body: body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
      }).then((response) =>{
        console.log(response);
        if (response.status>300) return {error:response.status, body:response.statusText};
        return response.json();
      });
    
    if (result.error){
      ElNotification({
        title:result.error,
        message:"нельзя обновлять несуществующие данные у кастом апи",
        type:"error",
        duration:2000
      });
      return post.sending=false;
    }
      [post.isEdit, post.sending] = [false,false];
      Object.assign(post,result);  
    
  }
  
  async function deletePost(post){
    post.sending=true;
    await fetch('https://jsonplaceholder.typicode.com/posts/'+post.id, {method: 'DELETE'});
    posts.value=posts.value.filter(el=>el!=post);
  }
  
  </script>
  
  <style scoped>
    .box-card {
      width: 480px;
    }
    .card-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 31px;
    }
  
    .card-header span{
      padding-right: 20px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden; 
      text-overflow: ellipsis;
    }
    
    .card-header .card-header-input{
      height: 31px;
      flex-grow: 1;
      margin-right: 20px;
    }
    
    .card-header .card-header-input label, .card-body label{
      padding-left: 2px;
      font-size: 10px;
      user-select: none;
      vertical-align: top;
    }
  
    :deep().card-header .card-header-input .el-input__wrapper{
      border:none;
      border-radius: 0px;
      border-bottom: 1px solid rgb(189, 188, 188);
      padding: 0px;
      margin: 0px;
      box-shadow: none;
    }
  
    :deep().card-header .card-header-input .el-input__wrapper .el-input__inner{
      padding-top: 1px;
      font-size: 16px;
    }
  
    .card-body{
      max-height: 120px;
    }
    .card-body .content{
      margin: 0px;
      margin-right: 10px;
    }
  
  
    .floatBtn{
      position: fixed;
      bottom:40px;
      right:40px;
    }
    
    .header-actions{
      display: flex;
      gap: 10px;
    }
  
    .el-icon{
      cursor: pointer;
    }
  
    
    .mdi-loading{
      margin-left: 13px;
      margin-right: 13px;
      animation: rotate 0.75s linear infinite;
    }
  
  </style>
  