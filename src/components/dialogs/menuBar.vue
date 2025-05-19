<template>
  <div class="menuWrapper">
    <div class="menuContent">
      <div class="blocos">
        <ul role="list" class="list">
          <li><a href="">Organização</a></li>
          <li><a href="">Estrutura</a></li>
          <li><a href="">Regimento</a></li>
        </ul>
      </div>
      <div class="blocos">
        <h2>Missão</h2>
        <p>Organizar a legislação Nacional e torná-las acessíveis e úteis para o usuário.</p>
      </div>
      <div class="blocos">
        <h2>Visão</h2>
        <p>Ser reconhecida pela excelência em aplicações de busca na legislação e jursiprudência.</p>
      </div>
      <div class="blocos">
        <h2>Valores</h2>
        <ul class="pl-6">
          <li>Comprometimento</li>
          <li>Ética</li>
          <li>Responsabilidade Social</li>
        </ul>
      </div>
    </div>
    <div class="text-center">
      <v-btn color="error" @click="$emit('menu')" variant="text">Fechar</v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menuWrapper{
  width: 100%;
  min-height: 10vh;
  border-top: 10px solid var(--primary-color);
  border-bottom: 10px solid var(--primary-color);
  margin-top: 1rem;
  padding: 1rem 0;
  background: white;
}
.menuContent{
  width: min(100%, 1000px);
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.blocos{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.blocos h2, p, ul{
  width: 100%;
}
.list li{
  padding: .5rem 1rem;
  background: rgb(239, 239, 245);
  margin-bottom: .5rem;
}
.list li:hover{
  background: var(--primary-color);
  color: white;
}
.list li:hover a{
  color: white;
}
</style>
