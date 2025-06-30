import { defineStore } from "pinia";

export const useGeralStore = defineStore("geral", {
  state: () => ({
    search: false,
    menuSide: false,
    headerShow: true,
    drawerHistory: false,
    titleApp: {title:'Leges', to: '/' }
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
    },
    readDrawerHistory(){
      return this.drawerHistory
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
    },
    changeDrawerHistory(value){
      this.drawerHistory = !this.drawerHistory
    }
  }
});
