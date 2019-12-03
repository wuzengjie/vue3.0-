<template>
    <div id="login">
        <img src="../assets/logo.jpg">
        <div class="loginContent">
            <form id="from" @submit.prevent="loginAction">
                <input type="text" class="loginClass" v-model="formObj.userName" id="userName" placeholder="Username" value="" autocomplete="off"/><br>
                <input type="password" class="loginClass" v-model="formObj.passWord" id="passWord" placeholder="Password" value="" autocomplete="off"/><br>
                <input type="submit" class="loginClass" id="submitBtn" value="Login"/>
            </form>
            <div class='tipWord'>Forgot password?</div>
        </div>
    </div>
</template>
<script>
import {post} from "@/store/api.js"

export default {
    name:"loginVue",
    data(){
        return {
            formObj:{
                userName:"",
                passWord:"",
                }
            };
    },
    methods:{
        loginAction(e){
            let NowThis = this;
            if(this.formObj.userName!=""&&this.formObj.userName!=null&&this.formObj.passWord!=""&&this.formObj.passWord!=null){
                           let result=post('/testLogin',{'userName':this.formObj.userName,'passWord':this.formObj.passWord});
                result.then(res=>{
                    if(res.loginStatus==200){
                       // NowThis.$store.state.token=res.token;
                       // console.log(NowThis.$store.state.token);
                        sessionStorage.setItem('access_token',res.token);
                        // 可以把路由router想象成一个访问记录的栈，router.replace()是替换掉栈顶，
                        // 而router.push()则是向栈中再堆如一个新记录。一般情况下，要做前进后退的
                        // 浏览记录管理的，基本上都是用router.push()，但是也是有一些特殊情况需要
                        // 用到router.replace()。比如，有一个授权页，用户在按流程操作时，某一步需
                        // 要授权，是直接跳到授权页，授权页提交授权请求，直到成功授权后，跳到流程中
                        // 的下一步操作的地址。此处，授权请求的那页面应该用replace去替换掉自身的访
                        // 问记录，防止用户跳到下一步流程后按后退键回退到授权页，而导致重复授权。

                        NowThis.$router.push('/success');
                        // setTimeout(() => {
                        //      that.$router.replace({
                        //         path: '/success',
                        //      query: {
                        //              redirect: that.$router.currentRoute.fullPath
                        //         }
                        //      });
                        // }, 1000);
                    }
                }).catch(err=>{
                    console.log(err);
                });
            }else{
                NowThis.Toast('用户名或密码不能为空');
            }

        }
    } 
}

</script>
<style scoped>
img{
    width:100%;
}
input{
    background:none;  
    outline:none;  
    border:none;
    font-family: "Microsoft YaHei";
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
box-shadow:0 0 0 60px #fff inset;
}
input:focus{   
    border:none;
}
.loginClass{
  width:70%;
  margin-top:28px;
  height:35px;
  background-color:#fff;
  font-size: 18px;
}
#userName,#passWord{
  border:none;
  border-bottom:1px solid #ccc;
  padding-left:40px;
  background-repeat: no-repeat;
  background-size: 25px;
  background-position-y: 5px;
}
#userName{
    background-image: url(../assets/user.png);
}
#passWord{
    background-image: url(../assets/psw.png);
}
#submitBtn{
  border-radius:50px;
  background-color: #ce6bec;
  color:#fff;
}
.loginContent{
    text-align: center;
}
.tipWord{
    margin-top:20px;
    font-size: 18px;
    color:#b3b1b1;
}
</style>