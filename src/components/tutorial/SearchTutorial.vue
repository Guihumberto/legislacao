<template>
    <div ref="entrar">
        Entrar
    </div>
</template>


<script setup>
    import { ref, onMounted } from 'vue'
    import { useShepherd } from 'vue-shepherd'

    const entrar = ref(null)

    const tour = useShepherd({
        useModalOverlay: true
    });

    onMounted(() =>  {
        tour.addStep({
        attachTo: { element: entrar.value, on: 'top' },
        text: 'Test'
        });

        tour.start();
    });

</script>