<template>
    <div class="bannerleges">
        <div>
            <h1>OH-MY-SEARCH</h1>
            <h2>Legislação</h2>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .bannerleges{
        width: 50%;
        height: 70%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // background: url('../../assets/hero.png');
        background-size: cover;
        background-repeat: no-repeat;
    }
    @media (max-width: 1000px) {
        .bannerleges{
            display: none;
        }
    }
</style>