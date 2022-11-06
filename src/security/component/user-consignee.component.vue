<template>
  <div class="log-in">
    <h1>Ingresa aquí</h1>
    <div class="user">
      <h5>User</h5>
      <pv-input-text type="text" v-model="user" placeholder="User"/>
     <!-- <span :style="{marginLeft: '.5em'}">{{user}}</span>-->
   </div>
  <div class="password">
    <h5>Password</h5>
    <pv-password v-model="password" :feedback="false" placeholder="Password" />
  </div>

  <div class="button">
    <!--<pv-button label="Log-In" @click=""/>-->
    <router-link to="/consignees" class="buttonlog">Log-In</router-link>
  </div>

    <p>Si no tiene una cuenta</p> <router-link to="/register" class="noaccount">Registrarse aquí</router-link>

  </div>
</template>

<script>

export default {

  data() {
    return {
      user:'',
      password: null,
    }
  },
  name:"user-consignee.component",
}

</script>

<style scoped>
pv-button {
  margin-right: .5rem;
}
.button{
  margin-top: 10px;
}

.log-in{
  margin-top:100px;
  text-align:center;
}
.buttonlog{
  font-family: Bahnschrift;
  padding: 14px 25px;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  background-color: #F1C40F;

}
.noaccount:visited, .noaccount:link{
  color: #F1C40F;
}
</style>