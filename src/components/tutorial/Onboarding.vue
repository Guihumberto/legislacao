<script setup>
    import { ref, onMounted } from 'vue'
    import { useShepherd } from 'vue-shepherd'

    const el = ref(null);

    const tour = useShepherd({
        useModalOverlay: true
    });
    
    onMounted(() =>  {
        tour.addStep({
            attachTo: { element: el.value, on: 'top' },
            text: 'Test'
        });

        tour.start();
    });

</script>
<template>
  <div></div>
</template>
