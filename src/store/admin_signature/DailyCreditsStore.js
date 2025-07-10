import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLoginStore } from '@/store/LoginStore'
import { useSnackStore } from '@/store/snackStore'
import api from "@/services/api"

export const useDailyCredits = defineStore('dailyCredits', () => {
    const remainingCredits = ref(0)
    const loading = ref(false)
    const error = ref(null)

    const snackStore = useSnackStore()
    const loginStore = useLoginStore() 


    // Computed
    const user = computed(() => loginStore.readLogin)
    const isUserPremium = computed(() => user.value?.is_premium)
    const userDate = computed(() => loginStore.readUser)

    // Actions
    const canUseCredits = async (creditsToUse = 1) => {
        if(isUserPremium.value) return

        if(remainingCredits.value == 0){
            snackStore.activeSnack('Você não tem créditos disponíveis para usar.', 'error')
            return
        }

        const userId = userDate.value?.login || user.value?.cpf
        const today = new Date().toISOString().split('T')[0];
        const docId = `credit_${today}_${userId}`;

        try {
            const response = await api.post(`daily_credits/_update/${docId}`, {
                    script: {
                        source: `
                            if (ctx._source.credits_used + params.credits_to_consume <= ctx._source.credits_limit) {
                                ctx._source.credits_used += params.credits_to_consume;
                                ctx._source.updated_at = params.now;
                            } else {
                                ctx.op = 'none';
                            }
                        `,
                        params: {
                            credits_to_consume: creditsToUse,
                            now: new Date().toISOString()
                        }
                    },
                    upsert: {
                        user_id: userId,
                        date: today,
                        credits_used: creditsToUse,
                        credits_limit: 5, // Padrão para usuários gratuitos
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
            });

            remainingCredits.value -= creditsToUse;
            snackStore.activeSnack('1 crédito  IA foi usado.', 'success')

        } catch (error) {
            console.error('Erro ao criar registro:', error);
        }
    }

    const checkCreditsBalance = async () => {
        if(isUserPremium.value) return { remaining: 5, used: 0, limit: 5 };
        const userId = userDate.value?.login || user.value?.cpf
        const today = new Date().toISOString().split('T')[0];
        const docId = `credit_${today}_${userId}`;

        if(!userId) return;

        console.log('teste teste');

        try {
            const doc = await api.get(`daily_credits/_doc/${docId}`);
                
            const remaining = doc.data._source.credits_limit - doc.data._source.credits_used;
            remainingCredits.value = remaining;
            
            return {
                remaining: remaining,
                used: doc.data._source.credits_used,
                limit: doc.data._source.credits_limit
            };
                
        } catch (error) {
            // Documento não existe, usuário ainda não usou créditos hoje
            remainingCredits.value = 5;
            return {
                remaining: 5, // Limite padrão
                used: 0,
                limit: 5
            };
            throw error;
        }
    }

    return {
        loading,
        error,
        user,
        isUserPremium,
        remainingCredits,
        checkCreditsBalance,
        canUseCredits
    }
})
