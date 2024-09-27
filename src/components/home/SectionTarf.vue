<template>
  <section>
    <div class="container">
      <h2 class="spaceh2">Tribunal Administrativo</h2>
      <div class="even-columns">
        <div class="imgBanner">
          <h1>TARF</h1>
        </div>
        <div class="listNews bg-grey-lighten-3">
          <div class="d-flex justify-lg-space-around">
            <div>
              <h2 class="ml-2 mt-2 titletarf">TARF</h2>
              <p class="pa-4">O Tribunal Administrativo da Secretaria de Fazenda do
                Maranhão torna públicas as pautas de julgamento dos processos administrativos
                fiscais, que serão analisados pelas três câmaras do TARF no atual exercício</p>
              <ul class="ml-10 mt-5">
                <li>Tribunal Administrativo</li>
                <li>Pauta de Julgamento</li>
                <li>Acórdãos</li>
              </ul>

              <p class="pa-4">Contatos do TARF: 3219-9062 / 3219-9063 / 3219-9064</p>

            </div>
          </div>

        </div>
      </div>
      <div class="btnWrapper">
        <v-btn variant="outlined" color="primary" width="300px">Pauta de Julgamento</v-btn>
      </div>
    </div>
  </section>
</template>

<script>
  export default {

  }
</script>

<style lang="scss" scoped>
.container{
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.even-columns{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.imgBanner{
  position: relative;
  width: min(100%, 48%);
  min-height: 31vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid grey;
  background-image: url(data:image/jpeg;base64,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);
  background-size: cover;
  color: white;
  border-radius: 8px;
}
.imgBanner::after{
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgb(109, 82, 185);
  opacity: 10%;
}
.imgBanner h1{
  font-size: 5rem;
  font-weight: 800;
}
.listNews{
  width: 48%;
  min-height: 31vh;
}
.btnWrapper{
  display: flex;
  justify-content: center;
  padding: 2rem;
}
@media (max-width: 700px) {
  .even-columns{
    flex-direction: column;
  }
  .imgBanner{
    width: 100%;
  }
  .listNews{
    width: 100%;
    margin-top: 1rem;
  }
}
.titletarf{
  border-left: 1rem  solid var(--primary-color);
  padding-left: 1rem;
}
</style>
