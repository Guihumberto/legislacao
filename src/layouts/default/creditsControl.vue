<template>
    <div v-if="user?.cpf">
        <v-chip v-if="isUserPremium" class="bg-orange text-white" density="compact">
            <v-icon size="1rem">mdi-star</v-icon>
            <span>plano pró</span>
        </v-chip>
        <v-chip 
            density="compact"
            v-else :class="circleColorClass" prepend-icon="mdi-hand-coin" link @click="$router.push('/planos')" title="Créditos IA">
            {{ remainingCredits }}
        </v-chip>
    </div>
</template>

<script setup>
    import { computed, onMounted, watch } from 'vue'
    import { useDailyCredits } from '@/store/admin_signature/DailyCreditsStore';
    import { storeToRefs } from 'pinia';

    const dailyCredtisStore = useDailyCredits()
    const { user, isUserPremium, remainingCredits } = storeToRefs(dailyCredtisStore)
    const { checkCreditsBalance } = dailyCredtisStore

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

</script>

<style scoped>
</style>