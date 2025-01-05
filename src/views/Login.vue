<template>
    <section>
        <div class="container">
            <div class="login">
                <bannerInit />
                <LoginLeges />
            </div>
        </div>
    </section>
</template>

<script setup>
    import bannerInit from '@/components/LoginCreate/bannerInit.vue';
    import LoginLeges from '@/components/LoginCreate/LoginLeges.vue';
</script>

<style lang="scss" scoped>
    section{
        min-height: calc(100vh - 600px);
        width: min(1080px, 100%);
        margin-inline: auto;
    }
    .container {
        height: calc(100vh - 466px);
    }
    .container .login{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
    }
    @media (max-width: 1000px) {
        .container .login{
            justify-content: center;
        }
    }
</style>