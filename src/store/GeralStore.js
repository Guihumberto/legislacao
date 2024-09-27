import { defineStore } from "pinia";

export const useGeralStore = defineStore("geral", {
  state: () => ({
    search: false,
    menuSide: false,
    titleApp: {title:'Legislação', to: '/' }
  }),
  getters: {
    readSearch() {
      return this.search
    },
    readMenuSide(){
      return this.menuSide
    },
    readTitleApp(){
      return this.titleApp
    }
  },
  actions:{
    changeSearch() {
      this.search = !this.search
    },
      changeMenu(){
        this.menuSide = !this.menuSide
    },
    changeTitleApp(item){
      this.titleApp = {
        title: item.title,
        to: item.to
      }
    }
  }
});
