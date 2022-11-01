<template>
  <div class="form-register">
          <div class="p-float-label">
            <h5>E-mail</h5>
            <pv-input-text type="email"
                           v-model.trim="user.email"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !user.email}"/>
            <small class="p-error" v-if="submitted && !user.email">
              E-mail is required
            </small>
          </div>
    <br>

    <div class="user">
      <h5>User</h5>
            <pv-input-text type="text"
                           v-model.trim="user.user"
                           required="true"
                           autofocus
                           :class="{'p-invalid': submitted && !user.user}"/>

            <small class="p-error" v-if="submitted && !user.user">
              User is required
            </small>
          </div>
    <br>

    <div class="pass">
            <h5>Password</h5>
            <pv-password v-model="password" v-model.trim="user.password" required="true" autofocus :class="{'p-invalid': submitted && !user.password}"/>
            <small class="p-error" v-if="submitted && !user.password">
              Password is required
            </small>
    </div>


  <pv-button :label="'Save'.toUpperCase()"  class="p-button-text" @click="register"/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      email: '',
      user: {},
      password: '',
      error: '',
      submitted: false,
     // user1: {}
    }

  },
  methods: {

  }
}
</script>

<style scoped>
pv-button {
  margin-right: .5rem;
}
.form-register{
  text-align: center;
}
.p-button-text{
  text-align: center;
}

</style>