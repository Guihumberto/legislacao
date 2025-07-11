<template>
     <section>
        <div :class="geralStore.readHeaderShow ? 'container': 'container2'">
            <v-sheet
              class="pa-8 mb-6 position-relative overflow-hidden mt-5"
              color="white"
              rounded="lg"
              elevation="0"
            >
              <!-- Elemento decorativo de fundo -->
              <div class="banner-decoration"></div>
              
              <!-- Conteúdo principal -->
              <div class="text-center position-relative">
                <div class="d-flex justify-center align-center mb-4">
                  <div>
                    <v-icon 
                      icon="mdi-scale-balance" 
                      size="48" 
                      class="text-primary me-3"
                    />

                    <h1 class="text-h4 font-weight-bold text-primary mb-1">
                      Bem-vindo ao Estudo da Lei
                    </h1>
                    <div class="text-caption text-grey-darken-1 font-weight-medium">
                      OAB • CONCURSOS • LEGISLAÇÃO
                    </div>
                  </div>
                </div>
              
                <!-- Indicadores de funcionalidades -->
                <div class="d-flex justify-center flex-wrap gap-3 mb-4">
                  <v-chip 
                    variant="tonal" 
                    color="primary" 
                    size="small"
                    prepend-icon="mdi-book-open-variant"
                  >
                    Legislação
                  </v-chip>
                  <v-chip 
                    variant="tonal" 
                    color="success" 
                    size="small"
                    prepend-icon="mdi-target"
                  >
                    OAB
                  </v-chip>
                  <v-chip 
                    variant="tonal" 
                    color="info" 
                    size="small"
                    prepend-icon="mdi-trophy"
                  >
                    Concursos
                  </v-chip>
                </div>
                
                <!-- <p class="text-body-2 text-grey-darken-1 mb-0">
                  Selecione uma das seções abaixo para iniciar seus estudos
                </p> -->
                 <p class="text-subtitle-1 text-grey-darken-2 mb-4 mx-auto" style="max-width: 500px;">
                  Sua plataforma completa para estudos jurídicos e preparação para concursos
                </p>
              </div>
            </v-sheet>
            <TutorialInit />
             <!-- <h1 class="text-h4 mt-6 text-center grey--text text--darken-3">
                Bem-vindo ao Estudo da Lei
             </h1>
            <v-sheet
div                class="pa-2 mb-6"
                color="transparent"
                rounded
            >
              <div class="text-center">
                  <p class="text-subtitle-1 text-center grey--text text--darken-2">
                      Selecione uma das seções abaixo para iniciar.
                  </p>
                  <v-btn color="primary" class="mt-5" variant="flat" prepend-icon="mdi-calendar" @click="$router.push('/homepainel/create_plan')">Criar meu próprio plano</v-btn>
              </div>
            </v-sheet> -->
            
            <SectionPainel 
              :concursos="concursos" 
              :title="{title:'Por Concursos', icon: 'mdi-file-multiple-outline', subtitle:'Legislação agrupada por concurso'}" 
              type="concursos" />
            <SectionPainel 
              :concursos="disciplinas" 
              :title="{title:'Por Disciplinas', icon: 'mdi-clipboard-text-outline', subtitle:'Legislação agrupada por concurso'}" 
              type="disciplinas" />
            <SectionPainel 
              :concursos="normas" 
              :title="{title:'Por Normas', icon: 'mdi-file', subtitle:'Legislação agrupada por concurso'}" 
              type="normas" />
            
        </div>
    </section>
</template>

<script setup>
    import { useGeralStore } from '@/store/GeralStore';
    const geralStore = useGeralStore()
    
    import SectionPainel from '@/components/painel/sectionPainel.vue';
    import TutorialInit from '@/components/painel/tutorialInit.vue';
    
    const concursos = [
        {
          id: 'stU46pYBHUN660Nl3bid',
          titulo: 'PGE-PI',
          banca: 'CESPE/CEBRASPE',
          img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADDCAMAAACxkIT5AAABhlBMVEX///8AAAD/zQD//v8BFikAMWn/zwD/0gAAdUEAQXH5+fn/0wCMprY3aYsAABPl6u8AAA7W4OMUXYKdoaX92l6SvKjm7/GhtsUAAAnY2Nrg4eK9rHGvs7beyHZwlKwBVn8AAB3/10gAABh6fYLMzc4Abjbr6+sAaS4ASXWLj5MACyK7vr9cYWh7e3uIiIi4uLjd1rsAT3k0PEdNUlmqra8SIDBmZmaYmJhxcXHE3tYAfz6kqyYAeD4AYh3e7uoAbkYAZCI5h2OFnC3J39dMknIAWACszL/x6NLUyKAATXAnMj8MHC4gKzlGRka7qmKVybj94XzfyoLWvwkrhTl3rJeYvapmkzRXljK3sxp/rpk+ijbnxBB5ny1GmHUAaUYqgj6nqCNnmyt1mTKXpilUijVfpY3JuRs9hDgggFRNhDe4uHa6vZkAI2idoIhJeZy5pFVeiaTF092xw8+tr4d9vaXPwZWvuKSZqJ77+Ou4nUKdu7kANV2Ts8IAOEoAQFkbO0VMc4gvSlQ16UuAAAAQf0lEQVR4nO1dj1/a2Ja/d6AQrmCVrEgiC4yE8COpFoIFWkEsNFOR1V1FK20d37RlHt23S4Gdmdfdaqfzn+85CaC2r+3ujC1DzPczjcklOvd87/nxPTeIhNiwYcOGDRs2bNiwYcOGDRs2bNiwYcOGDRs2bNiwYcOGDRs2bNiwYcOGDRs2rAOWVwi5tSKwnDzpqUwGQl5cIXmRrJCVFXaLTXo6EwAjBbBdzsvkTl65RYCDW/lJz+nrgrF/ESQwPSfgOZFXBCLduSUJk57XV4R4h6wUVvlL/h9icoEI1yYkZCUvjh1fHi9+Tli5c11yo7giQyIcQeLPT6Vb8vVICrK8khvZLUqSlBfk0erLqytkdVLz+pq4JRJ+ZLS4mgutrual0WtifkVSpI98o4WQv3MhGcqroVDuQjkQpYI4gTl9dUjK+TnLS3nlYjG4FqFwGcKqKOWvSzH4CGTwAXYtvP/3wDHpCfwJUJz0BL4ARolv6XPYuU3QC3YnOdkvAQfR9d3d3TI4+M6//tOn8W/IASm2Aue8WQLAAX7BtV369hsTLvzncj1x7bmM8+HB9c/IQbX0oFjc5MqTnfYVYxcW1XGJA8PgPdfd/XXgwHU+hByUm+SAKyVqFX3S8746gB8cLJA2uLfBwchil/vwEcdxz91HrhELBgeOQFknHYwG3SIksGKZtFitVEMKTA5cLrdh897+Prd+9/HhoycudAYDyAGJlxIcMNCe9NyvCsVSpRnndhfKVbwyYuHo3n3D6qfr6+t39x/ffYp54d7MntvkgNR0vZZoQTR0LJIWqxUuznGd49IC1gXgYOb593e5u09nvvnm8QZ3wu1z3NNvjo4O//qXF/dmDA50ZKtYSSwQvcOsIZY2OROVOEMOXPcgAE72T567XT8gAY/Wfzhy3zt5dvdk/97hHnIAQdNsFo2qEGhbwhNqIw420ailb92HG+scd7LxGLLC3rP9jaOne1AgngEb3Mb+nlkb9VKl1CEHG6AWLZEVdyvxeDxR68RreAV+8Jx7jCFwhBlh7+j7Jy6sEDOHQMGLe0/M2rjJqgccl0g8WJj07K8GeqBZa7ebmx3jCjiYuYv2rg/L44kbC8WTR+Ac6/vAB9YFEBJQSxIdvVxrWqF7YqiMGLhCZ7NdHtbGow3u+ZGpC2f+OoMc/Hj0/Bn3w49HbuQA8qBeai8YflM9mPD8rwI6ZvZiAhNCSR9y4H7241AUmRygbHLvcTNDfQBekADU0BsIC0zagj8OI6fpBgctMuIA5cHID9xDhfjksds16hc6nbLOcfpmCb7FMfXBUN6s6cUmZAMIBrMuoOH3n4y08TkHrkfuUb/QMgRiPFHZ5JoTnv9VoAwKKRHvtEgL0oHjgh+8z8E37sMRB9UFSIRF0tkErdSyAgltEIlcvFXjjo3L9zlwj/3gnAP0l1qp3THCqDz9AiGgG/ooHufa5z3TRT84+ZAD8ILNTruSOGCtlvFgesrBwJbEpknDuHc2OcC0eImDmXFOrIHtRW4zXnmAoTD1SVHfhSbQ8IXaZQ6wg55xz6zPuN0uQyq+mBn5wUIVy6KeiB9Ua7XpLwy1B2BPnCsmSlVjPUEnumegLrhdMzNH91+crHMnL5/95ckMjL6YgaPRMzHsuGsHHP6A6k/TTgGpgc7TKx2iF82wXvr2x/uHL9dfPrt3uLExbKY2Nr5/+fzZC+7l4f0jtxEL8C3HlUTHEEmOaRdJDrKgF1ttyAa7+m4VaNgBoXCORPx9VP4d95EOoGXWuU712BBJkzbij0IH0csdxOMQEc0SOPfOwcKn8TfgQDeesBQT4AoPLPCwhR0bJQFl8kEFjq8CNz+N27eNaljtlIuVWhU4nPYNdgdpm/KgpjsI4yCydyI3Pon/+E9DH1QrFa65iT8i0J7u7TTQOvFh3qsSVkS3fjX/GdzGnFh80NbjlTYpz8NFdcJW/DE4GAdZD/2gXKsd61jodxa972Fw+RLzQbFWxm6r06kk2NSrAwfRW9AwdOKBcrtoZPidrv8CvINwxHtpJAKxwMyVbybiTUgh084BYhO8oNNMJHZbRixceIWJggAHUb7YERixAFKxUz5u4ebqtKdEA814fPMYAiIRxzq3042MVrw3LwheuOrPz3vHg+gHBCkAHYHmV48nPP0/Cgcp1zqdYVbk4pjnd07Hkb8oCPNGQhCEfng8+ouhkZqEbcaLKJXKUy4THaQyqgtAwTGG9qvAEDeZON83T8ERbo6HMRaKVdJEiVSygkKCeB4xADIYd0PG+sDv7fvxa9Jz40avP4hc0AcORzVRajfjbf3AEk9ddTMUOgut5k/Iwbk+6OO/wQBP+vNsPPwQ/EBvlWuJBFaH2qTnfwWAngnTYU2vkVpiAZqmncHiOeYHkBbnxZveC2N/M7UyCEy9WSbV6RZIBhw6V4knDsqdRDPOxROJwE7Pcw4/pMV+/3QQOR+68V/fwbeVF0grXnqgT3/jbKL8E26MHifMyvDzd5+5/RU+ZeJK7XhHP6hZQiBhNBTLDtIqd7BzIo7XOz3fJ+D/ZclonVslfNq6OenJXxEcuDtejG9sYiiA6nm4FP4E/v7K1IxlrqhjNrCKH+gPOKNvahaN4L796uF3I5i3vB5d3l5aem0OdSqlErQKAWtwgHnRfMzCmbuqhN1+OMTPr37uev6+s/Tz8Pr2a7wDOsV2W6/W2hbJBghmaMX4QrkChS4QuGTZw6VfXr2+dHef4Dtx4BDofM1JfmEsJDAWKkUI8gXSSw4uvfjwvzEBmLTAMdC7Mc+wYSTEUm9ZXkgkau2EkeOb/+OJeHyXWLh94fxmOJnMdIdvzHRY6P3KDtR9NegAcUfIF/ZGMp6Id/7D+9igm/T4wz3PiKKp30G6BIejbL6fZNETHgy8vQwaO5g/X+dA39tNJpO+HnTSvgiO/wOSphywovNoWt+TyYRPT097XX8yCVq5Gw57wz1fxuNJRny+08FgsRtJvoMbB75JT/lLoO+JgCfIW5lMpucdeBe9vXddX9KfyUQiXZ/P28W91dNIJvPGCzefevyTnu8XQKCXiRglIfUGWPB3vWDxYBCByBiAXwx63V4YfCOSPJMgM/SSkczgsz9yuuAgXg+sd8Tz7iYh0tnZ20wkkwQ36Pl6p14Ih1434o9kIltvnTGMgwjem/RYLSUwXxLsgpLQAw0UcwINW34/tMpJs2NO+rbenp2t/SoRtug37ox4Fic956tH2AOGbW1tebZ6Xum37bOzX0NsfoA7KoN+4KZ6dnaWTinhd8kk3ANOkelPesJfAvM+T8RvLPdvhOTW1s621dFvuObAMZxwJaXPfn37Ft3Fax19dBl9KICQCbbe9SEt5H7DlUdTDa+IiYTNL25ljDjwWZUBUEjJjPe0i9oA5EC3t7X19s1br/fdG/B+XxhEQhI46iIHSety4EtmfN2et+c99Q7Cp+Geseh+c+kzfu+pz3sa9mYwFKxWGM/BBu+SxmL7fb3uO1zxrTd94nu7BZUyGen1/L2uD8/CVquKl8H6i2HjOXM3vNjfPtvKEOLNnK2l+t6ezx8BbryDm5Oe49fEzTcRcHoH82eSqUnPZWII+E6NL/5LcshSHfP/A9fVbmK1XRIbNmzYsHHFsKuEhR6p/H6ojev6+bpjMJqmsUlP4svAwRDnoS5LyvDDAtkI5iU/66QCuTjCpv/X+kzwFBHVzE8MlFUanKNR/CDNEB2ibt6YTafrRDRGgnW8IQdn1vioXVheRJpifyzQKJw6nej0ypzTfCVr3CdQ5ywPHJhjQRgMGY5hBSAHlC47DUdPp53LaS0adVKJrAIHwXM/iMEgMziYo/DKXMpaHFDG+DnncozgsQBjKo3m0A+CkozA21jUGVUJcjCrEAlcZc1qHBDScKY1ooEbYJqTMdyRA2GcAMErgorBwRx8SUWdQWY9DtLAAQS6On5BGcWC4QdID7nIAbUYB/IwFoLOKCTDnIYY50RqeAZ1LmPSBA6WQ0SC9LFtrViAnIgHgc0aHORpNJ2eZcjBbDAYNDhILTspfq6qmROD1suJo9roWMOkAH6QTTuj6AdziiAIxmdKb6fNEjmujZrVamOULhsaSU07Kb4taXUW5BBwQEf9gRR0zoXwBDlIDzWSpTiAfGAmf4WCIhKI5MTgRz+QRASQEzULhpkTh3dbi4Ox7M9GYZUNCSQbOXHOkMbQLhmJgozrggGLciA35kD+pJdBJo7rgtNJcmNrLcoBLPSF9o/PUroWk4njvGeiZrtkAHum0PBW6/RMl+D44ASBooD/8OZrhRhN02u/g6Rk1c/fZXlYZMPIxhgpSjXWoLRApAboY2l7LidSWaICpWkF0t8skSh1KpAE6qICNUJQKBEo9owOqCENAStDTKVUZUSlPKljJ8Wg4UgRoU5XPvd//3Mg1ZC289lYiEqNQoiK6RhPJZMDpbAMShHPlVgUDqomUUnTlCBRgkZOFGmuUJdpSBI1VYESWZ+NkazJAZ+jYhYGp+MP1qSypBDL8oSGlhU4UInBweCASZTw6rIk4cLzlIS2wQVyDeAgr86hcfCCQmWkQ4sRJ/wIVRtxIBGqOFcJzU3avP8TxhysIgerQYUIwpADMLnAN3JwZnCQW4MBvg4cqHwajZMoY6I45CCdA49IjzlwUMkZImP99OdGqi7XU1k1tc2CQw7IMB/wYFlWUVcucsDXeeCgLmkpQdN4yjRVplqWaVoqKisNgY45YFPFQZDWWbbeyI45YEMOstAsUjGlXeAgqNGQMgejMU1O5UOUFSAWUimmrtXXGK8ySAJTyQHuhTRGsRAKwuxXh7EAX2kutia9FwvL4PSxNXIpH6yQ5VwMcqByMR9MFwdreZjuLMwZrGBwgCoIzqDMScFsdhksl5AD3uCgoURhtB5kRj4InefEnNbIRnntgh/kpoYD7ADTwIESo2uUqMH0Gmmk52LIAeUbRAbzs3OaTEE9YKHYVoJ8HUYF4xkDhfvq9RRwMMsHJaKqWjqrAQeN7SAoisaUtBVSCMROTsK/0angs3QlxAgLKUTmmcwrkB1yUi63yoicA8XEEzEn5iQY5XFHFcfkXC6Hf7gupPAyEUIKXMKruRD+qOl5Nv+7307ywTcq172jhtjITs26fwZiLBZbZamUHIKTvBDjcSQlEimWhzzIx2IhPIJOlGGYKSnCYjEmF2QxJues0k5KtFBQ1Lq2FlKpmuLpGijlQnZbpuq2ChWgHoPKGFUhJ8JwQ+O3cT9NHEoKq/gBJH9CqCRTRsDQgjYL6gBkExTH1SAhagz+q/MkzRPsKGZTDaI0thUZORAtxAF4tLF1jlKnzlMR1tfkYG7IQXbIgSwtAwd8IctbjgOobjx2fIbcE2aVMQez73HAVudAQRT4WMFyHNTTjKRA4jGMCEeDFz/CQTBKY8BBXclnLccBwf3CGD5OEqRZMPljHFCQVsABlQzFbC0OGFoPBsERH6xo4sdyIpjMNxi+MU2yGgd5Xqqrph/EVMZDzcurywJNZaG9UjVIFYVGClKFwUG+YWQLicbUumwZDgRNgzyvagLoPjGWI0JW0jQVGgKtACbGNA1VkQYpU0RZmFMVVA2KpKqyaBmdOMY/6CPMX2iy369uw4YNGzZs2LBhw4YNGzZs2LBhw4YNGzZs2LAxbfhfVOXELfusMasAAAAASUVORK5CYII=',
          ano: '2025',
          descricao: 'Concurso para Procurador Geral do Estado do Piauí.',
          cargo: "Procurador Geral do Estado",
          concurso: "Procuradoria Geral do Estado do Piaui - PGE PI",
        },
        {
          id: 'o9Xx8pYBHUN660NldMOO',
          titulo: 'POLÍCIA FEDERAL',
          banca: 'CESPE/CEBRASPE',
          img: 'data:image/jpeg;base64,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',
          ano: '2025',
          descricao: 'CARGO 11: PERITO CRIMINAL FEDERAL – ÁREA 19: GENÉTICA FORENSE',
          cargo: "CARGO 11: PERITO CRIMINAL FEDERAL – ÁREA 19: GENÉTICA FORENSE",
          concurso: "PERITO DA POLÍCIA FEDERAL 2025",
        },
        {
          id: '8NU5E5cBHUN660NlEM_n',
          img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExIWFRUXFxUXFxcXGBUXGBUZGBUXGBcYFRUYHSggGB0lGxYVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLSstLS0tLS0tLS0uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMcA/gMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xABEEAACAQIEAwUFBAgDCAMBAAABAhEAAwQSITEFQVEGImFxgRMykaGxB1LB0RQjQmJykqLwgrLhFSQzQ3PC0vFTk+I0/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAIDAQQF/8QAKhEAAgICAgECBQQDAAAAAAAAAAECEQMhEjFBBBMiUWFx8DKBkcEjseH/2gAMAwEAAhEDEQA/ANPiACh3mqo1ZC8PGPIQfUGqxjXOdUhLVgftFsRctv8AeSPVW/JxW9ast2/sZsOr/dePRlP4haaPZNmS7KX8uJTxJX4gj6xXQS9crwt/I6v91lPwIP4V0m9fA1JAH1naK5fVw+JM9H0M/haHb2IVdWYAdTTVziCZWysrEAnQ7aHWq/jIzJDQmoK5pl9JlVAJAg7mKi8SKpbDA990I0GhG0j51KGG6LzzpX9DL3Wk6mfGkzTZNCa9M8MdN2j/AEg0xSa0B0ud6dt3utIuoyyhEbaGgRoNaALfD4gADr8hTlt+9mEROvSqlLp2qZhHLQsgCdz+dYBbFToORGkdeX4VD49h0a0LonOCFbyg/jU/D3xpImIHLUg+HlUftDfW2LiqO66wOvvSD+fwrPJpnLVxiCJ0CmPQio5FLsCc2p0U7c9Rp/fSkNTim8+y4f74nhbufQD8a7IrVxz7LP8A+zysv9UH4118NUZdlUPTQYAiCJB3B1B8xTYalZqUAWcNbUyqKD1CgH4gVIzU0Gow1ADgajzU0WoM1ADWMv5VZp2Un4CuQ4dv1JJ3cu3xNdI7V4jJhbx/cI+OlYjsjwpcVeSy5YIELNliYAGgnxIrDfBm+F8IuYgt7MDSJkwNfGlYjgOKQwcNcP8ACuYfFZFdtwPZXDWly2gVHkCSepJ1J8adfgtsf80jzUf+VFszRhfZ3i3ft2lA97LJJkaGT5/WnWNWWWfp8v8A38arLmhIrWUYDVT2ks58LeHRSw80Ob8KsyaRcSQVOxBB8joa1CM4uRWr4dxQXFRcwtGAsZbl03CABJz3gsEnRQOUVmMVbKsyncEg+YMH6Vd8Oxp/QbltfeS6t2P3CpViPI5Z8KeS0GN0xzj2IuuxzXXfKSseztJBBIjJbcsNZ3FQF4lcbMGzMxUKSf2VUEAAR3QJPx8asrGPN+yp1OIt3CCwMFkeCpGvJhB9Kl8RwrFTcZV9u2b2jq47ylR7yBgA06GBrvvU7UaTLuLm20ZWiozSZq5xippFCgKAFiTRxSsOgJAJA8SYHqeVEd6wBQFSMOxjSohNSsKdaDS6whaA09JnkOWvKi7VWg1i24YSrFSOeon5Ef1VKwDBVbaSp08uUbdDVXx9/wBQpj3nOuvIf61nkCjwv7X8B+q0hqXhf2v4T/mWkNTim/8AspH+9t4WG/z266zNcp+ygf7xdPSz9XT8q6kGqMuyqHgaOaazUrNSmjqt40M1MF6Aess0fU6Ubmmw1E7VopmftBun9EIG7Og+dRexDixbxmLIkWbJjxgM5HrkUetJ+0K/3LCdbhb0VT/5VXY/EG1wS6QYa/eVR5Z1kfy23+NaD6Mpju1GMvEm5irpmdFdkTyCIQIqruHMZbU9Tqfiah5qP25q1ETuVo71DxtvXNG9Rb3H7KA5T7VvupqPVth8z4VWWePvdZVe2q9+AVYsI1ENpvJ8NxpUqOlyRZzSGpZNNtSmHL+1uHyYq6OrZv5gG+pNRuEXWViRqBEqfdKsYbMPLT1q9+0KxF1H+8keqk/gwqi4Hey3Ndip06xqB8qr4EX6i7wy2bKsoMMTPeIzAHZSfAUxibkT3hB8vlVXxFjnLHnrQxJmyh6Ej61Ljbs6lOk0kNPTdKamzV0cTBNGDSTRUGC5owaRNDNQbY4tWHC1L3FRB3ieew8T5VXrVt2cbK5b0pZOkPBXKi44nhUsaLdFw7OIy5SQdtTIqL2ggYO2D7xcFfQEH61D4hofNmY+u3ypntK8eyTmFZvRiAP8lLG3Rs6TdFZhj738P/ctIajw37X8P/ctJaqEjo32Tj9bf/6aD4sfyrpgNc0+yf38Qf3bQ+dz8q6OGqUuyo+POjJpWDwz3DCCevIDzNXGH4B99/RfzP5UjkkF0UevUUm44UFiwA5yYAnxNan/AGFY5qf5j+FQuMdk7F+2bbNcUEg91hOmo94HnSWuzVJFNaxKt7rKfIg/SlM1N8N7AWrF72qX2PdKAMq/tFdcwI6RtzqbxfAmwhuO65BEkmIkxzplNA6vRzP7QL84i2v3LbN55j/+arPtAvZMBgLB3M3SPEIJ+d40ntjea7ime2QUyIqtIg6Ek9dCTSe0961intnK4W0pRRIEjSSYBjYc6fkkw9uUujDA0M1X1/g1ph3CyN+8Qyn1gFfnVJicM1tsrjKfH6jqKrGal0TljlHs2CfTyYDrHMQNNOtOWX7ynoy+Ma/Ees7VTWeJKRqOX3R686cucT6Lr4nY6ajnp0nnW8WKjoRNIJpNt8yhuoB+ImgaiXMv2+sZrCN9149GH5qKwuEaHXzA+On4103tLZzYW6Oi5v5SG+gNctmNeY1+FPHoR6dmit4RLjBbhcaxoAPmfyNO8Z4Ytu2FthiCZ1OYz5gDlT2J2DDwINWLkMozHSAdIJ28a5HNqmeisUbaZj79kqokRUY1seJWlu2vZqMuWSviepPlp/ZrHGurHPkjz80OMtdCTQoiaKaoSFA0AaTmpSCg1Eiys1Y4ExpTWFtaUdqVaeVTk7LwVFwuHzOqkdN6pu1bziWH3Qi/BQfxrYYHJdupcQQMsEdGH/sVguLXfaX7rDXNcbLGsiYWOugFGMXLrRY4Ds7fdc4UQyyBmg7ggnkNPGpHD+zTFyL821A0IKyxnkdRpVpYx95EUMqpAErOoO2kbeVLxGHuY+/asWVDPlc6z5kkgdFpFObdHN8TdFlwjCHCi57Jz38syBIyzEGP3j8q1XCeMG4UTIScveaYAgbkRzMfGsNiOw/EbX/Jb/C4H1INRracRsElVxC9TlZh6mCKODu+Q6jNO2dH4rxz9GuWzndMwYAqJGkTmAMxqOR51Kwvb48sTab+MZPm4WuScR43iLmUXnzFZjMoUiYn3Y6Cooxx+6PQkfnSywtuy8ZQrZ3q12ydhraS4Ottp+YkVLtdsLY/5Lg+Yrz9+mgHYg9QQfnpT68Zuf8Az3QOma5+BNK8Duxv8b8nbOMdtSi5lRbQ+/cM/wAojU+Anyrm/aDtP+khkzPcJjvscqiCD3E35c48qzF/EKxnOCepOv8AVSbXlPlr9Kz22ikVBPskBfKlhPGo4bwpwelKyyY7lp1LrRlBkDkVDAeQaYqNTbYkAxNX9Ph92fG6I58qxxuiovpkeI0Oo9f9adB/v60zjsUruFGoBjN+Xy+FPpYI6GurkkcSi2tHQeBXs2HtnouU+a90/Sphqs7O4Q27QGcMGOcQCIBA01qyNc0u9Fl0IvW8ylTswI+IiuQXkIYg7gwfOuwMa5h2isZMTdH75P8AN3v+6miZItsC2ewv8Meq6fhUnC3R7MyYCzJ6DeovZ9D7KCCIYx5GD9Zqpx2JklFPcn+aOdc/DlJxOyeXjCM/pQvFcUc6Kco8N/U1WmjY0jNXXGKS0efKTk7YDSQKVNFFMKKW2Cd6l2bMVBinLdwjnStDJpF1bpYWoeGxAbwNT7KyRUmjoUlRa8Lv+ys3bv3EYr5x3R/NHxrFYW+1sypgxEwJAO8dDGk+JrcDgt3Eqti2VRSwNy45hVC6x1YkwYH3dYmrx+wODwyK7X3uuRuUsOk8/wBU528586dNIjO2zA9l+DHEtdVWUOEzDNPe7w3I5ePiK3X2U8JvW8XfKsEuWbYUkBXHfYEgE6ahCJ5TWq7EW8DZZi9q17WTF0WEtjIcvdyIIBkTMetD7MhcdcXi7YtkYjFXYzgzlEMmSCIA9owjwFPjlcictI2lgcQylgcO4Oqgh1bfmwkeoFHdv35AuYAMObLcRo0+4RNTFxWJRVBwwbQzkuAx0gMJNKHG1Hv2r1vxZRHyNVf2Qq0NWOGWbyBmw+TU9xhlYQxEwp2O48DULGdh8FcMnDWt9TkSY8GKk1phQqfXQzd9mDxf2UcPbUWyvk1z6Bwvyqmxf2MWD/w71xfNlI+Hs5+ddVoVtgcRxP2L3Qe5iQfBrYH9QufhVRi/slx67eyceDXAf6rYHzr0LRT1oA8x4vsZxCz71hwP3bltvkjk/KqXDXGY6sY869L9vuJfo/DsVdmGFplU9Hufq0/qcV5qwawPX6aVPJXErh/UPGev0qJffXWpJO9QLza1T0i7YerfSIGOs+zuMo/ZbT6itjwu3buIGyj51muN2x7a5/FPyFWfZW9llJkHUDp1rnnuNlMepUbThmlsDoWA+M/jR4nHW03bXoNT/p61S4i+wJXNCzMbbiq+/iFHnSRbekNJJO2XN/izH3QB47n8qoeIKGfM2pO7H4amol7iBA0Mf3yqru3idSTT+2/LE92K6RZcQx+S0UtwS2hPQc6oRcNPFppvLVIRUUTyZHN2wi1FNHFFlpyYKMCiy0RU0AOCnQgiTUYORUyxiEJ17v09aAGcwnStB2ZcXryWWYIWMBjsTyHmToKpL2D5p3h1GtNJI3FY1ZqdHoK72ZxhtJbS6gVIKIwYqDscym2dRLb86jP2KxV4/rLWFtHSGRWzNvJY5ifTTyrH9nvtVxlqwMP+quMuiXLwuMwWNFbIwLRyO9SR9qPEDLA2Wjdbdi8Z+J0+NTWJDvLJ6LrH4IYBb+dluMll2iIAJUhFEzqWK68ga1n2WYYW+HYVAQSQ1w9f1jFhP+ErXJu1/H2xWe57Nka+La5Cc2qlDvA+5ERzrvnCuC2rdu0vswGtKig+KLkB84HzqkKROWy1oUKFaAKFFPhR1idgChQoVoAqj7T9nRjBZVnyrauC7lg94gQNQQVgFvj4VeUKDU6dnHvtfL4bA28O13O1/EFzuIt2k0UCeTG0SeZJrD3ux+PtDvYS4YAPdh9I6ISa132nf75xrD4Oe7bRA2+habtzbaba26m3OBPZMW7+ItbwFuEp6DnrSTXgeM2nZzQ4O4iublp0IAADqymWMbMByzVSOZNdC7eYi+LNu3dxBvAszrKqpXKuXUjVvfG/SudTXT6eNRI5pcmW/G8EPaE7EwfPSPwqtw2ZHVoiCPWrzjFwFxpy5iJ8RUQgEa7f3zFefyrR6Diuyx4tiwFDAiSIA/Gs8zkmSaDXJO+209KZc1eEeKOXJPkxN5qZNKY02TTEwUk0ZoqABQoU4iTQAiKes2CfAU/asgU8BNaA2tsbAUX+z1PM1JAApQ86DBkYRQZAIPUEj/3SntHrmH7wn5ini1JN1etAEY2B0y+sj48vWtv2d7W3Ai2L6e0IMIwOpnQBubHoeeg1rHsyn9qkd9DNs+Mf3saWUVJUxoy4uzZdpOJ4cXMIwWct5bt4ZXDwhQhZYAQ0voNBHlXUcJ9q2AckFyNJnkdYgB8rTziK4Pxvi93ElLl8sWCBQZzaSTqCZB18tKi28FM6gHlnKpPkSY+dEVSNcrdnqiz2iwrKje2RQ4zKWOUEaagtpzHxqytXVYSrBh1BBHxFeRxg8Ra7ypcA3zW5I8ZdJHzpVntFiVcOt5swEZp1jz39d6YU9c0K818I+0fiVvUXrlxehyvHq6s0fnWt4D9tDSwxiIv3SiODs2j946yFEheZMCIoA7PQrFcA+0zBYnTOEbMQFZ0BYSozAOVOXvdJ0OmlWXDu3nDb8BMbZk7K7ezY+S3IJraA0dCk27gYSpBHUGR8RVB2v4p+jYLE4gGClpyv8ZGW2P5mWoZc3CUY12zUjmPYg/pnGMdjCAyA3Ap3EM3s7Z/+q2fjXQLdtbiEHVZbKdNhsRGn3h/hrCfZLYt2sGzsSfa3Pdj9m3CqZidGDbmNa12JxzOCqd0RqSfTUk6Ctk/iG8HKvtHv/rQsyFRR6sxJ+SrWJroXabsrfxF53S5YgsIzXCDAUKNlI5dedZzG9jcch0w5uD71ordHwUyPUCu3FKKilZCSdi7twudv78qqcfiY7nTePpV1hry7bedZV7wMmNSSfiZ2rzsSt2zvzulQ8nhSLwpkLzU60GunnXScgljRUCaBoAI0VHRhawAIs0+oikqKVmrQHs1KV6jhqUHFBhIDUv2lRxdo5oAfyzzpQtim0NOKOpigAxaFOKgFNG6vWiFwEwaAFlTzXT50ZsiPClB6JrtADaWiuqEqeqsVPyipD429s5Fz/qolz4FhI9DTKXf76U57X6RQAkm0few+U/es3HQ+i3M6/CKTdwdltRfuIY0F62WHrctkmP8ABUxkUloIjKCJEE+ug/v1pJsbaESsyDI031MfXfSgCB/sS43/AA2tXf8Ap3En+R8r/wBNRcVZu2tLqPb/AOorLPlmGtW4wYeIgzO4jUbidpE9afw4v21BtXLqqfusSh9NVNAFZw3jl+zlNu4yZZgIzJuZM5CJ1q34x28xeJw7Ya7cZkJUkHvTkYMJZpbcA78qYvW86km1abfUoqNMaEvaKE+oNV3DuHv7a2GSBnE6gggan5CmkmlbQLZ2TgeCFrD2bekrbUH+IiW+ZNRuM8SCMLJmGAaRrDCY0O+hOnryp/huKdxLKI6xE1l+LY8NirikgQQuu2g5z1M6VBKxycr3N1yuP3WEnyUw3yqZhr93/wCK4P8AA35VU4ewByHoTHw5VNs3Mp90HTYz+FYFGNRV1knwqD2e4TbvWmZwZDAAgwR3ZOm3PmKt2RVRiOSkz6VUcBwjXLSBSBlxKOZ00CAGPTlXOpPg2nR2Zl8SIr8DcWzcBmHKhYMkB8kj15VCw9gtnzd0IrMZGxBACx1LECtfbxTNeFnTILdp/U3Vkz4g/KqbgeCW+bhYSGuAzzAAuO2vIHug+dUjllTcjmcFeiiEeVAoeVXHG+EKhuMmiqqMRqdXcrCn0mqm5YdArEEBwSp+8B0/vnV4TUlaJuLTEU6DFNi711o8wPUf34U5gstSaI2+hmiM9KAFzRqJptYpZvZdBvQA+tvrRl1HOocOetGLBoAljGDlTL32YxQTCTUkEJsJoAYSz1p62edEt4NpEDzp5ooMHZmjAqMLtE100AKuqVOYDTmKN7oAzDahbYxrtyP51GutBiNKALPgFwFmQzLKShB/aXvZeneAInqB1NTLcjJIIglT3SCN+anQ+EaRrVJYbKcy+cdPKr2zhXfu2oZnI091jOuhXQGN52mhIG0Lzfq2nWHkDRpEjloTudNyTNKS+AQMpzT3F8euveXTXQ8qZxNq5aaL1p1H70Nm8nWdutN2sZm7xiYyqJDBBERlOx0BJnlQ012C2TL/AHQFnM3vMWBkeC5l01BG9WnY7hn6ReLtIt29B+8x/wBPrVJhMM124tpB3nOp5DqT4D8hXU+DYFbNtbaCAOfMnmT4nekm9GpFhYw6iByrnnEsKty41zLMuTpAM5j3WB0MGRrEV0JjoaouJcEW4S6MbbncrBDfxKdD570kW10MzPcNwpT9oFcqgAaQQTJjUakn6cqsEim7vCcUuxtt4iVPqCag3WxNn/iKMp2IGYT0kH5VsnZq0U2MceyuEckb/KaouGcRa1hyyxJuhdZ0m2xkfyitLjbY9k67Aow+KkViLd4eyyc86vPkrCP6hUMMVKLT+Z0+pbUkabhml3yw+F+ts1B4USuCuH7y3I9fZJ9S1WeBQeztuPfuJbTXbuW3P1C/AVAxNo28EUbRpWR5335jf3KE03X1RJqt/cjPiWfCQRJ9pbtDeSFUuJ8ZapXayyAcPaXkpQfFV+opPCbEjDKRp7S7dbr+rAiR5iKN3N2/hDESPaHzNxnP+Wtup38rf5/Bna/gs+KcJstlXKA2ZVzLAOgkgxoTlU7iqjGdmyIyPMkABhGup94eAJ25U/g7Lpibztr3Lt0QZkk93TrEjai4HxR7hLXSGFpHuTEGYjWNNi3KkXuRVp2l/Yz4vtFJjcBcskZ1idiCCDHiPxqOt0+fzrW37y4kYdgsTd2OpGVWJ+nzqVj8PauKTCMSQoYQSCzBfeGuhMx4U69S1SktivF8mYsOOY+FGscvnp9a0XFOztsKzWyykAnKdVMcpOo+dZuxZZzCqWMEwBJgbmBV8eWM1aJyg4umP+0I3/v1pz2oqErEbGjF3qPhpVBSW18VHOI12psoTqKTqKDBTLOwo1RuhpaYk7U5+kUGhJc6ipqZSJqC2JoW7x8qDCwgDUVCeJ3pwX9NaZY0ALDVbYO4CqgESBtOo9KqY0qVw7hb4jMlqTcALBRqXUESBHMaNHQHpRryBcrinDBixYrEFu9EHT3pprE3ZJYxmJJ2jfXQD6VVYn9KRjmBDSxYZeZOoyEDKPAARPlVl2evObouuqkJspEDMNZImRG/z/ZIob0FI6B2R4J7FPaOP1jjWf2RyX8T4+VaVPKqHB9qbR0dGQ9feA89iOfKrnB46zc0S6rH7sw38p168qixkPONJpkA9Kkum4G9MlY1oQBOKbPiKeAoBRzrDTnHs1OhAiueXbZRmU7qSp9DH4V0YJWK7S2Mt8kbNDeuxHxE+tR9NLbR2+rjcUyPg8c1tlYH3ZgHUa76Ve4HiNu85DgAZU0YiCyu7GDz94fA1mTSQ1dE8al9zjjNo2hxqj9exMZGMxyvXjGnkgqK2IBxIujULhmcH1br51mzi3yFMxynLpv7swB0HeOlTsNjlCXJ0b9H9ku+pkzBG3rUvZrf7D+5ei04VxMEXb9zu6Wk0k8zOn+IU3icQDbxV0GQxt2lPUaFv8x+FR+GYT2mHZc2WXzbTsANRQfBOcOttACfasSZAGmZAdeWgNLUFJ/dL9vxG/FRbcBsxbtbTkuXPIscqfItVbwXhVxMUoeDCs5IM5gAR5+8RuKnYvFi0lxkE5BZsqD+7qfk/wAqa4TxGfbX2GURbtjc7kz8yKS51Jrp/n9m0tIZ4fjrrJiXckhVMBv2WaYX/Typ/slZCWrt47wQvkoliPWP5aY7T48x7DUmQWGs9QI6kxUq4Rbt3LS/8nDEHxe5qfpP+Kte4dVf+jOpfYqOG2VGFv3HUE9xEkAkMdyDyIzAyOlVM1bYw5MHZTm7tcPiBIHyK1UFtK6se7f1/wCEpCku06e9uY6VGNGtyKoKBlIos1OlppoigBSxTkDkaYoA0ASc0aUYNMA04tAEkbVN7PcRNjEW7oJBBI0MbgjflvPmBVeTTcSKGCO3jtth7ua1i0tsYBCsO83dBJXPAmRAIaNxprWmwuMwF22ltkthGAVUOVddxHPMN9CTOtcCvXTdsI7d42wbbneBIgnw1HqTTeD4hctkNbuMomdDoIGndPjU0htHd8X2HwlwKbZZCP2UJYHoYuaiPw2jah4h2AxFvNkZHAEhQe+w/hYRpB0zahR0rE8I7c4i03eOecgIzMuscrbGBy2GtbLgv2od0BmJfXSBbnWNA5K/MT4Vmwr5Fbeu4zCkB/aIDsHBIMclD/hrtzmZNvta2ntLanxUleU6AyG9CJkeQ3WG7U4Z4RigLEkRAJjcqGldp50WL7PYHEGcmRn3ZWKwTHeVR3SZMzG8naKAM1g+PWXjvZD0eB/UCV8d9tatQARIMjqNvjVZjvs3cKWsXQ50MFcoM81dTAiQdumwmqHEcCxeHIhGGYaMhzLHSeRGgg9DGhoZhRXLxbwX5mqPtJh81vOo0Q6nwOhHxjbaKvXtg6nMesQB8Br86cvWRctsn7JUrpykRtyrhhLjJM9bJHlFo53ypsmnSpAg6EaHz50zXpHki4os1HSDWmErC49091oHTcfCrDDccyrBSSNoO58elUooTSSxxl2hlNro0vCnR7eV8rFmZmB6k7xQxVtbdlVXQPiB46KADv8AvLWbD0/+lMcssSEMqDqASZPjqan7Tu7G56qi/vWM/EGnZcrnyVFI/qipPGVAsX7gHef2YJE97vCPkTVO/Fwfbtlh7wVRBkKAAG311FOcLacOUnX29vSf2RlJ06aGpuElTfikMpLa+YntL3Xt2uVu0i+vP5AVTPWg43gg2e9mMwJ2IMCB5fOs8athknBUJkTUthUKFFVRBQNHmpFHQAo0VChNAB0tLkU1moUASGv9KSjzpTIpaUGF12axKrd9m/uXIVh6/kT6xScXhcl17ZOqMyhtO8ASAdNDI19agBJ235Ebg1Nu3j7znvH8qWt2NeqG1HQ85g6iYjajAMRE6AaajeT3W/CmbFyTPKpQFYzYqx/CcQdD3XZdWJAPIDTuN+Bq94V2uvWiT70hCwBKksdB3G02jbes8y6bT4U2u8ajUGG1Bjbfas0xqfg6nwn7QoGVyfaKYgxaLGQYE93YSdgYrYYftxaUA3GUA7ZtNYGgZZnbXX6VwNGYRMkDMfvAk7d1vwNSMBiCphXIAUAhXy6kzqr/AIVlBryWlrGBtBoedOC+oO+tChUOK6OtTb2HdyRoB8KSnBbN73kUTzXQ/EUKFJbXRRU+yh7QdmbmGh5DWzs2kjwI/Ks+1ChXXjk2tnDmioy0FQoUKoSBQoUKAADS1bWef986KhQBKbiDlChaQY330M7+lQyaFCsSS6NbbBNCioVpgJoUKFAB0maFCgA6FChQYHNGDQoUGj4xFNM5Y6mhQoAm4Val2CJg+lChWM1Euxbgkkz0HSlYq2pgkUKFTHTE5aBSd9aFCsHo/9k=',
          titulo: 'POLÍCIA FEDERAL',
          banca: 'CESPE',
          cargo: "CARGO 15: ESCRIVÃO DA POLÍCIA FEDERAL – ÁREA 19: GENÉTICA FORENSE",
          ano: '2025',
          descricao: 'Escrivão da Polícia Federal. Provas dia 20 de agosto de 2025.',
        }
    ]

    const disciplinas = [
         {
          id: 1,
          titulo: 'DIREITO CONSTITUCIONAL',
          descricao: 'Legislação e Assuntos relacionados a direito constitucional',
        },
        {
          id: 2,
          titulo: 'DIREITO TRIBUTÁRIO',
          descricao: 'Legislação e Assuntos relacionados a direito tributário',
        },
        {
          id: 3,
          titulo: 'DIREITO ADMINISTRATIVO',
          descricao: 'Legislação e Assuntos relacionados a direito admistrativo',
        },
    ]

    const normas = [
         {
          id: 1742907731755,
          titulo: 'CF88',
          descricao: 'Constituição Federal de 1988 vinculadas a questões e súmulas',
        },
        {
          id: 1742907901454,
          titulo: 'CTN',
          descricao: 'Lei 5.712/1966 (CTN)  Denominado Código Tributário Nacional',
        },
        {
          id: 1747758035994,
          titulo: 'Nova lei de licitações',
          descricao: 'Lei 14.133/2021. Lei estabelece normas gerais de licitação e contratos.',
        },
        {
          id: 1747696504895,
          titulo: 'Lei de Processo Administrativo',
          descricao: 'LEI Nº 9.784/1999. Regula o processo administrativo no âmbito da Administração Pública Federal.',
        },
        {
          id: 1746666536052,
          titulo: 'Lei de Improbidade Administrativa',
          descricao: 'LEI Nº 8.429 DE 1992 - Lei de Improbidade Administrativa.',
        },
        {
          id: 1750194743901,
          titulo: 'NOVO CÓDIGO CIVIL',
          descricao: 'LEI Nº 10.406, DE 10 DE JANEIRO DE 2002 - NOVO CÓDIGO CIVIL.',
        },
    ]

 
</script>

<style scoped>
.banner-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border-radius: 50%;
  z-index: 0;
}

.banner-decoration::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 40px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.01) 100%);
  border-radius: 50%;
}

.gap-3 {
  gap: 12px;
}

/* Animação sutil para os chips */
.v-chip {
  transition: all 0.3s ease;
}

.v-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsividade */
@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }
  
  .d-flex.flex-wrap {
    flex-direction: column;
    align-items: center;
  }
  
  .v-chip {
    margin-bottom: 8px;
  }
}

</style>