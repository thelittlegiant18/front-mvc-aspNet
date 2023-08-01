<template>
  <main class="body">
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.min.css"
          integrity="sha512-ZnR2wlLbSbr8/c9AgLg3jQPAattCUImNsae6NHYnS9KrIwRdcY9DxFotXhNAKIKbAXlRnujIqUWoXXwqyFOeIQ=="
          crossorigin="anonymous" referrerpolicy="no-referrer"/>

    <div class="container" id="container" ref="container" :class="{ 'right-panel-active': isRightPanelActive }">
      <div class="form-container register-container">
        <form v-on:submit.prevent="handleRegister">
          <h1>Registrate aquí.</h1>
          <input type="text" placeholder="Nombres" v-model="name" required>
          <input type="text" placeholder="Apellidos" v-model="lastName" required>
          <input type="email" placeholder="Email" v-model="email" required>
          <input type="password" placeholder="Contraseña" v-model="password" required>
          <button v-show="!register.loading" class="w-100 btn btn-lg btn-warning" type="submit">
            Registrar
          </button>
          <button v-show="register.loading" class="w-100 btn btn-lg btn-warning" type="button" disabled>
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Registrando...
          </button>
        </form>
      </div>
      <div class="form-container login-container">
        <form v-on:submit.prevent="handleLogin">
          <h1>Logueate aquí.</h1>
          <input type="email" placeholder="Email" v-model="email" required>
          <input type="password" placeholder="Password" v-model="password" required>
          <button id="login" v-show="!useLoginFetch.loading" class="w-100 btn btn-lg btn-warning" type="submit">
            Ingresar
          </button>
          <button v-show="useLoginFetch.loading" class="w-100 btn btn-lg btn-warning" type="button" disabled>
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            Ingresando...
          </button>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1 class="title">Hola</h1>
            <p>Si ya tienes una cuenta por favor inicia sesióna aquí</p>
            <button type="submit" class="ghost" id="login" @click="deactivateRightPanel">Ingresar
              <i class="bi bi-arrow-left login"></i>
            </button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1 class="title">Registrate <br> aquí</h1>
            <p>Si aún no tienes una cuenta, unete a nosotros y comienza tu viaje.</p>
            <button type="submit" class="ghost" id="register" @click="activateRightPanel">Registrar
              <i class="bi bi-arrow-right register"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRegister } from '@/stores/register'
import { useLogin } from '@/stores/login';

const isRightPanelActive = ref(false);
const register = useRegister();

const activateRightPanel = () => {
  isRightPanelActive.value = true;
};

const deactivateRightPanel = () => {
  isRightPanelActive.value = false;
};

const name = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");

const useLoginFetch = useLogin();

onMounted(() => {
  useLoginFetch.logged()
})
const handleRegister = () => {
  register.registerUser(name.value, lastName.value, email.value, password.value)
};

const handleLogin = () => {
  useLoginFetch.login(email.value, password.value);
};

</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins");

* {
  box-sizing: border-box;
}

.body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Poppins", sans-serif;
  overflow: hidden;
  height: 96vh;
}

h1 {
  font-weight: 700;
  letter-spacing: -1.5px;
  margin: 0 0 10px;
}

h1.title {
  font-size: 45px;
  line-height: 45px;
  margin: 0;
  text-shadow: 0 0 10px rgba(16, 64, 74, 0.5);
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  text-shadow: 0 0 10px rgba(16, 64, 74, 0.5);
}

span {
  font-size: 14px;
  margin-top: 25px;
}

a, option {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  transition: 0.3s ease-in-out;
}

a:hover {
  color: #406e49;
}

.content input {
  accent-color: #333;
  width: 12px;
  height: 12px;
}

.content label {
  font-size: 14px;
  user-select: none;
  padding-left: 5px;
}

button {
  cursor: pointer;
  position: relative;
  border-radius: 20px;
  border: 1px solid #153c30;
  background-color: #153c30;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  margin: 10px;
  padding: 12px 80px;
  letter-spacing: 1px;
  text-transform: capitalize;
  transition: 0.3s ease-in-out;
}

button:hover {
  letter-spacing: 3px;
  border: 1px solid #406e49;
  background-color: #406e49;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: rgba(225, 225, 225, 0.2);
  border: 2px solid #fff;
  color: #fff;
}

button.ghost i {
  position: absolute;
  opacity: 0;
  transition: 0.3s ease-in-out;
}

button.ghost i.register {
  right: 70px;
}

button.ghost i.login {
  left: 70px;
}

button.ghost:hover i.register {
  right: 40px;
  opacity: 1;
}

button.ghost:hover i.login {
  left: 40px;
  opacity: 1;
}

form {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px;
  height: 100%;
  text-align: center;
}

input {
  background-color: #eee;
  border-radius: 10px;
  border: none;
  padding: 12px 15px;
  margin: 4px 0;
  width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 25px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 500px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.login-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .login-container {
  transform: translateX(100%);
}

.register-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .register-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {

  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translate(-100%);
}

.overlay {
  background-image: url('../assets/img/anonymous.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(to top,
  rgba(46, 94, 109, 0.4) 40%,
  rgba(46, 94, 109, 0));
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}
</style>