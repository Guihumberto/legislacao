import { defineStore } from "pinia";

export const useGeralStore = defineStore("geral", {
  state: () => ({
    search: false,
    menuSide: false,
    headerShow: true,
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
    },
    readHeaderShow(){
      return this.headerShow
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
    },
    changeHeaderShow(){
      this.headerShow = !this.headerShow
    },
    changeHeaderNoShow(value){
      this.headerShow = value
    }
  }
});
