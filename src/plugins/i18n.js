import Vue from 'vue';
import VueI18n from 'vue-i18n';
import pt from 'vuetify/lib/locale/pt';

Vue.use(VueI18n);

const messages = {
  pt: {
    ...pt,
    dataTable: {
      itemsPerPageText: 'Itens por página:',
    },
  },
};

const i18n = new VueI18n({
  locale: 'pt',
  messages,
});

export default i18n;