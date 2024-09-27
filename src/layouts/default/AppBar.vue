<template>
  <header class="primary-header" id="pri-hea">
    <div class="wrappersubheader">
      <div class="subheader">
        <h6 class="ml-n2">
          <v-app-bar-nav-icon density="comfortable" variant="text" @click.stop="drawer2 = !drawer2"></v-app-bar-nav-icon>
          <!-- <img class="img_flag" src="../../assets/flagma.png" /> -->
          <v-icon>mdi-script-text</v-icon>
          <span class="gov">LEGISLAÇÃO</span>
        </h6>
        <div class="rigthSubheader">
          <router-link to="/about" class="mr-2">FALE CONOSCO</router-link>
          <!-- <v-icon @click="dark = !dark" size="small">{{ dark ? 'mdi-brightness-3' : 'mdi-brightness-4'}}</v-icon> -->
        </div>
      </div>
    </div>
    <div class="container">
      <div class="d-flex justify-center align-center">
        <v-app-bar-nav-icon :disabled="!resultSearch.length" class="btn-side-bar" color="white" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="logo" @click="$router.push(titleApp.to)">
          <small class="text-white">{{titleApp.title}}</small>
          <h1 class="text-white texto_title">OH-MY-SEARCH</h1>
        </div>
      </div>
      <nav class="navbar">
        <ul role="list">
          <li> <a @click="menu = !menu">INSTITUCIONAL</a></li>
          <li> <a href="#">CONTATO</a></li>
          <li> <a class="active">QUEM SOMOS</a></li>
        </ul>
      </nav>
      <div class="btn_group">    
        <loginInfo :flutuante="false" class="gov" />   
        <v-btn title="E-MAIL" icon="mdi-email"></v-btn>
      </div>
    </div>
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
  >
    <div class="text-center my-5">
      <v-avatar class="mb-3" size="5rem" variant="tonal" color="blue"><v-icon size="3rem">mdi-account</v-icon></v-avatar>
      <h3>Nome do usuário</h3>
      <h4>@emaildousuário</h4>
      <!-- <v-btn color="red" variant="text" class="text-lowecase">Sair <v-icon class="ml-1" size=".9rem">mdi-logout</v-icon></v-btn> -->
    </div>
    <v-divider></v-divider>
    <v-card
      class="mx-auto"
      max-width="300"
      elevation="0"
      color="transparent"
    >
      <v-list density="compact">
        <v-list-subheader>Menu</v-list-subheader>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
</v-navigation-drawer>
</template>

<script>
  import sidebarleft from '@/components/legislacao/sidebar/sideLeft.vue'
  import MenuBar from '@/components/dialogs/menuBar.vue'
  import loginInfo from '@/components/partiaslLayout/userInfoLogin.vue'

  import { useGeralStore } from '@/store/GeralStore'
  const geralStore = useGeralStore()

  import { useGeneralStore } from '@/store/GeneralStore'
  const generalStore = useGeneralStore()


  export default{
    data() {
        return {
            dark: false,
            menu: false,
            drawer: false,
            drawer2: false,
            items: [
              { text: 'Início', icon: 'mdi-home' },
              { text: 'Documentos', icon: 'mdi-folder' },
              { text: 'Favoritos', icon: 'mdi-star' },
              { text: 'Histórico', icon: 'mdi-history' },
            ],
        };
    },
    computed:{
      resultSearch(){
          return generalStore.readResultSearch
      },
      titleApp(){
        return geralStore.readTitleApp
      }
    },
    methods: {
        isSearch() {
            geralStore.changeSearch();
        },
        scroll (refName) {
          const element = document.getElementById(refName)
          element.scrollIntoView({behavior: "smooth"})
          this.menu = false
        },
        linkUrl(item){
          window.open(item, '_blank');
        },
        handleScroll() {
          if(this.menu){
            let menu = document.getElementById('menu');
            menu.style.opacity = 0;
            
            setTimeout(() => {
              this.menu = false
            }, 1000);
          }
          
        },
    },
    components: { MenuBar, sidebarleft, loginInfo },
    created(){
      setTimeout(() => {
        this.isSearch()
      }, 1);
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>

<style>
header{
  background-image: linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%);
}
header h1{
  font-weight: 700;
  font-size: 2rem;
}
.menu {
  position: fixed;
  z-index: 1000;
  transition: .5s ease;
  animation: aparecer .8s ease;
}
@keyframes aparecer {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
.btn-side-bar{
      display: none;
    }
.wrappersubheader{
  background: var(--primary-color);
  color: white;
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
  font-weight: 500;
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
  height: min(10%, 10vh);
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
.subheader h6{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .3rem;
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
}
</style>
