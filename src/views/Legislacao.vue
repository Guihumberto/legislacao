<template>
    <div class="legesWrapper">
        <div class="sidebar-left pr-2" id="sidebar-left">
            <sideLeft @large="largeSidebar()" />
        </div>
        <section-search/>
        <div class="sidebar-right">
            <side-right type="screen" />
        </div>
        <v-navigation-drawer 
            location="right"
            v-model="geralStore.drawerHistory"
            temporary
        >
            <side-right type="drawer" />
        </v-navigation-drawer>
    </div>
</template>

<script setup>
    import { ref, inject } from 'vue'

    import SectionSearch from '@/components/legislacao/search.vue';
    import sideLeft from '@/components/legislacao/sidebar/sideLeft'
    import sideRight from '@/components/legislacao/sidebar/sideRight'
    
    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()

    const large = ref(true)
    // const drawerHistory = inject('drawerHistory')

    const largeSidebar = () => {
        large.value = !large.value
        let menuLateral = document.getElementById('sidebar-left');
        if(large.value) {
            menuLateral.style.width = '250px';
        } else {
            menuLateral.style.width = '350px';
        }
    }
</script>

<style scoped>
.legesWrapper{
    display: flex;
    justify-content: space-between;
    align-items: stretch;
}
.sidebar-left, .sidebar-right{
    width: 250px;
    transition: 1s ease;
}
.sidebar-left{
    border-right: 1px solid rgb(233, 221, 221);
}
.sidebar-right{
    border-left: 1px solid rgb(233, 221, 221);
}
@media (max-width: 1600px){
    .sidebar-left, .sidebar-right{
        opacity: 0;
    }
}
@media (max-width: 1500px){
    .sidebar-left, .sidebar-right{
        display: none;
    }
    .legesWrapper{
        justify-content: center;
    }
}
@media (max-width: 1670px) {
    .sidebar-left{
        width: 250px;
    }
}
</style>