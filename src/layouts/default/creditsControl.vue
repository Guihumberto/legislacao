<template>
    <div v-if="user?.cpf">
        <v-chip v-if="isUserPremium" class="bg-orange text-white" density="compact">
            <v-icon size="1rem">mdi-star</v-icon>
            <span>plano pró</span>
        </v-chip>
        <v-chip 
            density="compact"
            v-else  :class="[circleColorClass, { 'highlight': shouldHighlight }]" :prepend-icon="remainingCredits == 0 ? '' : 'mdi-hand-coin'" link @click="$router.push('/planos')" title="Créditos IA">
            <v-badge
                v-if="remainingCredits"
                color="error"
                :content="remainingCredits"
                inline
            ></v-badge>
            <span v-else>assinar</span>
        </v-chip>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue'
    import { useDailyCredits } from '@/store/admin_signature/DailyCreditsStore';
    import { storeToRefs } from 'pinia';

    const dailyCredtisStore = useDailyCredits()
    const { user, isUserPremium, remainingCredits } = storeToRefs(dailyCredtisStore)
    const { checkCreditsBalance } = dailyCredtisStore

    const shouldHighlight = ref(false)

    const circleColorClass = computed(() => {
        if (remainingCredits.value === 0) return 'bg-error'
        if (remainingCredits.value <= 2) return 'bg-orange'
        return 'bg-success'
    })

    watch(user, async () => {
        await checkCreditsBalance()
    })

    onMounted( async () => {
        await checkCreditsBalance()
    })

    watch(remainingCredits, (newValue, oldValue) => {
        if (oldValue !== undefined && newValue !== oldValue) {
            const difference = newValue - oldValue
            
            // Highlight temporário
            shouldHighlight.value = true
                setTimeout(() => {
                shouldHighlight.value = false
            }, 2000)
        }
    })

</script>

<style scoped>
    .highlight {
        animation: highlight-pulse 2s ease-in-out;
    }

    @keyframes highlight-pulse {
        0%, 100% {
            transform: scale(1);
            filter: brightness(1);
        }
        50% {
            transform: scale(1.05);
            filter: brightness(1.2);
        }
    }
</style>