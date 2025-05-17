<template>
    <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <div class="login">
                <bannerInit />
                <LoginLeges />
                <!-- <LoginFirebase /> -->
            </div>
        </div>
    </section>
</template>

<script setup>
    import bannerInit from '@/components/LoginCreate/bannerInit.vue';
    import LoginFirebase from '@/components/LoginCreate/loginFirebase.vue';
    import LoginLeges from '@/components/LoginCreate/LoginLeges.vue';

    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
</script>

<style lang="scss" scoped>
    section{
        width: min(1080px, 100%);
        margin-inline: auto;
    }
    .container, .container2 {
        height: 40vh;
    }
    .container .login{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        transition: 1s ease;
    }
    @media (max-width: 1000px) {
        .container, .container2 .login{
            justify-content: center;
        }
    }
    @media (max-width: 600px) {
        .login {
            padding-bottom: 15rem;
        }
    }
</style>