<template>
  <header class="primary-header" id="pri-hea">
    <div class="wrappersubheader">
      <div class="subheader">
        <h6 class="d-flex align-center">
          <v-app-bar-nav-icon density="compact" variant="text" @click.stop="drawer2 = !drawer2" :disabled="!loginStore.readLogin.cpf" title="Necessário estar logado."></v-app-bar-nav-icon>
          <router-link to="/leges" class="linkinitial">LEGISLAÇÃO</router-link>
        </h6>
        <div class="rigthSubheader">
          <router-link to="/about" class="mr-2">FALE CONOSCO</router-link>
          <router-link to="/login" class="mr-2" v-if="!loginStore.readLogin.cpf">ENTRAR</router-link>
          <a @click="loginStore.logOut($router)" class="mr-2 text-orange" v-else>SAIR</a>
          <Notification v-if="loginStore.readLogin.cpf" />
          <v-btn 
            title="ocultar cabeçalho" 
            density="compact" 
            variant="text"
            @click="changeHeaderShow()" 
            :icon="geralStore.readHeaderShow ? 'mdi-chevron-down' :'mdi-chevron-right'">
          </v-btn>
          <!-- <v-icon @click="dark = !dark" size="small">{{ dark ? 'mdi-brightness-3' : 'mdi-brightness-4'}}</v-icon> -->
          <v-app-bar-nav-icon 
            icon="mdi-history" class="historico" density="compact" variant="text" @click.stop="geralStore.changeDrawerHistory" 
            v-if="generalStore.readListStore.length && $route.name == 'Legislacao'"></v-app-bar-nav-icon>
        </div>
      </div>
    </div>
    <v-expand-transition>
      <div v-if="geralStore.readHeaderShow">
        <div class="container">
          <div class="d-flex justify-center align-center">
            <v-app-bar-nav-icon 
              :disabled="!generalStore.readResultSearch.length" 
              v-if="generalStore.readResultSearch.length"
              class="btn-side-bar" color="white" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <div class="logo" @click="$router.push(geralStore.readTitleApp.to)">
              <small class="text-white">{{geralStore.readTitleApp.title}}</small>
              <h1 class="text-white texto_title">OH-MY-SEARCH</h1>
            </div>
          </div>
          <nav class="navbar">
            <ul role="list">
              <li> <router-link :class="$route.name == 'Legislacao' ? 'active' : ''" to="/leges">INÍCIO</router-link></li>
              <li class="hidden btn-menu"> <a @click.prevent="menu = !menu">INSTITUCIONAL</a></li>
              <li> <router-link :class="$route.name == 'Legislacaoporlei' ? 'active' : ''" to="/legesporlei">NORMAS</router-link></li>
              <li> 
                  <a  href="https://blogleges.estudodalei.com.br/" target="_blank" rel="noopener">BLOG</a>
                  <Novo />
              </li>
              <li class="hidden"> <router-link  to="/about">QUEM SOMOS</router-link></li>
            </ul>
          </nav>
          <div class="btn_group">    
            <v-btn variant="flat" title="chat arcadio" icon="mdi-chat" class="mr-1" @click="linkTo()"></v-btn>
            <loginInfo :isLogin="!loginStore.readLogin.cpf" :flutuante="false" />   
          </div>
        </div>
      </div>
    </v-expand-transition>
  </header>
  <menu-bar @menu="menu = !menu" class="menu" v-if="menu" id="menu"  />
    <v-navigation-drawer
        v-model="drawer"
        temporary
    >
        <sidebarleft />
    </v-navigation-drawer>
    <v-navigation-drawer 
      location="left"
      v-model="drawer2"
      color="#ECEFF1"
      v-if="loginStore.readLogin.cpf"
    >
      <div class="text-right">
        <v-btn variant="text" @click="drawer2 = false">Fechar</v-btn>
      </div>
      <menuUser />
    </v-navigation-drawer>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, provide } from 'vue'
  import sidebarleft from '@/components/legislacao/sidebar/sideLeft.vue'
  import MenuBar from '@/components/dialogs/menuBar.vue'
  import loginInfo from '@/components/partiaslLayout/userInfoLogin.vue'
  import menuUser from './MenuUser.vue'
  import Notification from './Notification.vue'

  import { useGeralStore } from '@/store/GeralStore'
  const geralStore = useGeralStore()

  import { useGeneralStore } from '@/store/GeneralStore'
  const generalStore = useGeneralStore()

  import { useLoginStore } from '../../store/LoginStore'
import Novo from '@/components/partiaslLayout/novo.vue'
  const loginStore = useLoginStore()

  const dark = ref(false) 
  const menu = ref(false) 
  const drawer = ref(false) 
  const drawer2 = ref(false)   
  
  
  const changeHeaderShow = () => {
      deslocarTela()
      geralStore.changeHeaderShow()
  }

  const deslocarTela = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isSearch = () => {
      geralStore.changeSearch();
  }

  const handleScroll = () => {
    if(menu.value){
      let menu1 = document.getElementById('menu');
      menu1.style.opacity = 0;
      
      setTimeout(() => {
        menu.value = false
      }, 1000);
    }  
  }

  const linkTo = () => {
    window.open('https://legislacao.estudodalei.com.br/chatarcadio', '_blank');
  }
    
  setTimeout(() => {
    isSearch()
  }, 1)

  loginStore.loadUserData()
    
  onMounted(() =>  {
    window.addEventListener('scroll', handleScroll);
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });

</script>

<style>
header{
  background-image: linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%);
  margin-top: 1rem;
}
header h1{
  font-weight: 700;
  font-size: 2rem;
}
.linkinitial{
  font-size: .9rem;
  color: #fff;
}
.menu {
  position: fixed;
  z-index: 1000;
  transition: .5s ease;
  animation: aparecer .8s ease;
}

.btn-side-bar{
  display: none;
}
.wrappersubheader{
  background: var(--primary-color);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--primary-color);
  color: white;
  z-index: 1000; /* Para garantir que fique sobre outros elementos */
}
.subheader{
  display: flex;
  justify-content: space-between;
  width: min(90%, 1000px);
  margin-inline: auto;
}
.rigthSubheader{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
.rigthSubheader a{
  color: azure;
  font-size: .8rem;
  transition: .5s ease;
}
.rigthSubheader a:hover{
  letter-spacing: 1px;
}
.logo{
  line-height: normal;
  cursor: pointer;
  user-select: none;
  transition: 1s ease;
}
.navbar ul li {
  display: inline;
}
header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: min(90%, 1000px);
  margin-inline: auto;
  padding: 2rem 0;
  transition: 1s ease;
}
.navbar a{
  position: relative;
  display: inline-block;
  margin-left: 1.5rem;
  padding: 0;
  transition: .6s ease;
  font-weight: 500;
  color: white;
}
.navbar a::after{
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 100%;
  height: .5rem;
  background: white;
  border-radius: 5px;
  transform: scaleX(0);
  transition: transform .5s;
}
.navbar a:hover::after{
  transform: scaleX(1);
}
.navbar .active{
  position: relative;
  display: inline-block;
  margin-left: 1.5rem;
  padding: 0;
  transition: .6s ease;
  font-weight: 500;
  color: white;
}
.navbar .active::after{
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 100%;
  height: .5rem;
  background: white;
  border-radius: 5px;
  transform: scaleX(1);
  transition: transform .5s;
}
.subheader h6{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .3rem;
}
.btn-menu{
  cursor: pointer;
}
.img_flag{
  height: .9rem;
}
.btn_group{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search{
  display: flex;
  transition: 1s ease;
  transform: scaleY(0);
}
.search.activeSearch{
  transform: scaleY(1);
}
.historico{
  display: none;
}
@media (max-width:500px) {
  .gov{
    display: none;
  }
  .texto_title{
    font-size: 1.3rem;
  }
}
@media (max-width:740px) {
  .navbar{
    display: none;
  }
  header .container{
    margin-top: 2rem;
    padding: 1rem 0;
  }
}
@media print {
    header {
        display: none;
    }
}
@media (max-width: 1600px){
    .btn-side-bar{
      display: flex;
    }
    .historico{
      display: block;
    }
}

@media (max-width: 1018px) {
  .navbar .hidden{
    display: none;
    background: red;
    transition: 1s ease;
  }
}
</style>
