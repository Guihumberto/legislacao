<template>
    <div class="headerWrapper">
        <header class="header">
            <h5>Arcádio</h5>
            <nav>
                <a href="">Home</a>
            </nav>
        </header>
    </div>
</template>

<script setup>
</script>

<style scoped>
.headerWrapper{
    width: 100%;
    border-bottom: 1px solid #ddd;
    background-color: #f4f4f4;
}
.header{
    width: min(100%, 1080px);
    margin-inline: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
}
</style>