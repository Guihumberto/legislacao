<template>
    <div class="bannerleges">
        <div>
            <div>
                <v-icon size="4rem" class="mb-2" color="#030231">mdi-text-search</v-icon>
                <h1>OH-MY-SEARCH</h1>
                <h2>Legislação</h2>
            </div>
            <p class="my-2">Encontre a solução jurídica que você precisa com rapidez e precisão – sua busca na legislação começa aqui!</p>
        </div>
    </div>
</template>

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
    .bannerleges div h1{
        line-height: 1;
    }
    @media (max-width: 1000px) {
        .bannerleges{
            display: none;
        }
    }
</style>