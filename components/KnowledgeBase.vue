<template>
  <div class="knowledge-base">
    <HeaderBar :userName="userName" :chiriks="chiriks" />
    <div class="kb-card">
      <div class="kb-title">База знаний</div>
      <div class="kb-section">
        <div class="kb-list">
          <p>Главная ценность нашей компании - это люди.<br>
          Мы любим и ценим наших сотрудников. Для нас важна простота, душевность, открытость, а также личностные качества и взаимоуважение к команде</p>
          <p><b>Принципы нашей компании:</b></p>
          <ol>
            <li>руководитель должен быть лидером</li>
            <li>ответственность заменяет согласования</li>
            <li>если столкнулся с проблемой - реши ее</li>
            <li>свое мнение обязательно нужно отстаивать, но только до принятия решения</li>
            <li>быть недовольным очень вредно</li>
            <li>прозрачность повсюду</li>
            <li>никто никому ничего не должен</li>
            <li>никто ни в чем не виноват</li>
            <li>юмор и простота нужнее серьезности и умничанья</li>
            <li>доверие нужнее контроля</li>
          </ol>
          <p><b>Запрещенные слова:</b></p>
          <ul>
            <li><b>Выражения-отказы</b>
              <ul>
                <li>Не могу</li>
                <li>Не знаю</li>
                <li>Не успею</li>
                <li>Мне некогда</li>
                <li>Не получится</li>
                <li>Это не реально</li>
                <li>Это не мой вопрос, обратитесь к …</li>
              </ul>
            </li>
            <li><b>Вступление в диалог</b>
              <ul>
                <li>Как я могу к Вам обращаться?</li>
                <li>Чем Вам помочь?</li>
                <li>Вас беспокоит компания «Строительный Двор Комплектация»</li>
                <li>Извините за беспокойство</li>
              </ul>
            </li>
            <li><b>Шаблонные извинения</b>
              <ul>
                <li>Извините за сложившуюся ситуацию</li>
                <li>Приносим извинение за доставленное неудобство</li>
                <li>Извините, что так получилось</li>
              </ul>
            </li>
            <li><b>Фразы без смысловой нагрузки</b>
              <ul>
                <li>Спасибо за ожидание</li>
                <li>Я Вас прекрасно понимаю, но</li>
                <li>Спасибо за понимание</li>
                <li>К сожалению</li>
              </ul>
            </li>
            <li><b>Оправдания</b>
              <ul>
                <li>Я забыл</li>
                <li>Я не слышал</li>
                <li>Я им говорил</li>
                <li>У меня и так много проблем</li>
                <li>У меня много работы</li>
                <li>Не мог до Вас дозвониться</li>
                <li>Вас много, а я один (одна)</li>
              </ul>
            </li>
            <li><b>Слова, подчеркивающие безразличие</b>
              <ul>
                <li>Ладно</li>
                <li>Все равно</li>
                <li>Постараюсь</li>
                <li>Без разницы</li>
                <li>Вам решать</li>
                <li>В любом случае</li>
              </ul>
            </li>
            <li><b>Слова с уменьшительно-ласкательными суффиксами</b>
              <ul>
                <li>доставочка</li>
                <li>счетик</li>
                <li>машинка</li>
                <li>кирпичик</li>
                <li>минуточку и др.</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bottom-buttons">
      <v-btn class="app-arrow" @click="$emit('back')" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './HeaderBar.vue'
const userName = 'Александров А.'
const chiriks = 50
</script>

<style scoped>

.v-btn.app-arrow {
  height: 12vh !important;
}

.knowledge-base {
  height: 96vh;
  width: 96vw;
  padding: 0 12px 16px 12px;
  display: flex;
  flex-direction: column;
}
.kb-card {
  background: #fff;
  border: 1.5px solid #ffe6a0;
  border-radius: 14px;
  margin-top: 12px;
  margin-bottom: 24px;
  padding: 16px 12px 12px 12px;
  max-width: 100%;
  box-sizing: border-box;
}
.kb-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #757575;
  margin-bottom: 8px;
}
.kb-section {
  margin-bottom: 8px;
}
.kb-subtitle {
  font-size: 1rem;
  color: #444;
  margin-bottom: 8px;
}
.kb-list {
  font-size: 0.98rem;
  color: #222;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}
.kb-list ol, .kb-list ul {
  padding-left: 20px;
  margin: 8px 0 8px 0;
  max-width: 100%;
}
.kb-list li {
  margin-bottom: 4px;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}
.kb-list p {
  margin-bottom: 8px;
}
.kb-item {
  margin-bottom: 4px;
}
</style> 