<template>
    <section>
        <div class="main">
            <aside class="left">left</aside>
            <main>
                Main content
            </main>
            <aside class="right">right</aside>
        </div>
    </section>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
section {
    min-height: calc(100vh - 454px);
    position: relative;
    background: red;
    margin: 0;
    padding: 0;
}
.main {
    background: yellowgreen;
    display: flex;
    justify-content: center;
    flex: 1;
    min-height: calc(100vh - 454px);
}
main, .left, .right {
    padding: 2em;
}
.left, .right {
    min-width: 200px;
}
.left {
    background: blueviolet;
}
.right {
    background: blueviolet;
}
main{
    background: rgb(235, 230, 230);
    width: min(100%, 1080px);
}
</style>