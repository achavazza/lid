,<template>
  <div class="hero-body">
    <div class="container has-text-centered">
      <div v-if="!quizStarted" class="box">
        
        <h2 class="is-size-2 mb-5">Erstellen Sie ein individuelles Quiz</h2>
        <textarea v-model="customQuestionIds" class="textarea" placeholder="Fügen Sie die Fragen-IDs durch Kommas getrennt ein z.B.: 49,136,190..."></textarea>
        <button @click="loadCustomQuiz" class="button is-medium mt-5">Starten Sie das Quiz</button>
      </div>

      <div v-else class="box">
        <div v-if="currentQuestion">
          <div class="question-number"><strong>{{ currentQuestion.id }}</strong></div>
          <div>
            <h2 class="is-size-2 has-text-left mb-5">{{ currentQuestion.question }}</h2>
            <img
              v-if="currentQuestion.image"
              :src="currentQuestion.image"
              alt="Question Image"
              class="question-image"
            />
            <ul class="has-text-left">
              <li v-for="(choice, index) in currentQuestion.choices" :key="index">
                <button
                  @click="selectAnswer(index)"
                  class="button is-medium my-1"
                >
                  {{ choice }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="quizFinished" class="results">
          <h2 class="is-size-2 mb-5">Quiz-Ergebnisse</h2>
          <nav class="level mb-5">
          <div class="level-item level-left has-text-left">
            <p class="is-size-4">
              <span class="heading">Punktzahl</span><br />
              <span class="title">{{ correctAnswersCount }} / {{ quizStore.questions.length }}</span>
            </p>
          </div>
          <div class="level-item level-left has-text-left">
            <p class="is-size-4">
              
              <span class="heading">Bestandene (nötig: {{ quizStore.approvalScore }})</span><br />
              <span class="title" :class="{ approved: quizStore.isApproved, notApproved: !quizStore.isApproved }">
                {{ quizStore.isApproved ? "Sie haben bestanden!" : "Sie haben nicht bestanden" }}
              </span>
            </p>
          </div>
          <!--
            <div class="level-item level-left has-text-left">
                <p class="is-size-4">
                    <span class="heading">Residential Approval (needed: {{ quizStore.residentApprovalScore }})</span><br />
                    <span class="title" :class="{ approved: quizStore.hasResidentApproval, notApproved: !quizStore.hasResidentApproval }">
                        {{ quizStore.hasResidentApproval ? "Achieved!" : "Not Achieved" }}
                    </span>  
                </p>  
            </div>
           -->
          </nav>
          <ul class="has-text-left">
              <li v-for="result in quizStore.results" :key="result.question.id" class="mb-3">
                  <h3 class="has-text-weight-bold">{{ result.question.question }}</h3>
                  <p>Richtig Antwort: {{ result.question.choices[result.question.correct] }}</p>
                  <p>
                    Deine Antwort: {{ result.question.choices[result.userAnswer]}} <span :class="{ correct: result.isCorrect, incorrect: !result.isCorrect }">
                      {{ result.isCorrect ? "Richtig" : "Falsch" }}
                  </span></p>
                  
              </li>
          </ul>
          <button @click="resetQuiz" class="button is-medium mt-5">
            Quiz neu starten
          </button>
        </div>

      </div>
      <p class="mt-5"  v-if="quizStarted && !quizFinished">
        Individuelle Quiz - {{ customQuestionIds }} - {{ remainingQuestions }} Fragen verbleiben.
      </p>

    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted } from "vue";
import { useQuizStore } from "@/stores/quizStore";

const quizStore = useQuizStore();
const quizStarted = ref(false);
const quizFinished = computed(() => {
    return quizStore.currentQuestionIndex === null && quizStore.results !== null;
});

const states = computed(() =>
  Object.keys(quizStore.stateQuestions).filter((key) => key !== "generalQuestions")
);

const customQuestionIds = ref('');
const customQuestions = computed(() => customQuestionIds.value.split(',').map(id => id.trim()));

const currentQuestion = computed(() => quizStore.questions[quizStore.currentQuestionIndex]);
const remainingQuestions = computed(() => quizStore.remainingQuestions);
const correctAnswersCount = computed(() => quizStore.correctAnswersCount);
const isApproved = computed(() => quizStore.isApproved);

const selectState = async (state) => {
  quizStore.setState(state);
  quizStore.loadQuestions();
  quizStarted.value = true;
};

const selectAnswer = (index) => {
  quizStore.selectAnswer(index);
};

const resetQuiz = () => {
  quizStore.resetQuiz();
  quizStarted.value = false;
};

const loadCustomQuiz = async () => {
  const ids = customQuestions.value.map(Number).filter(id => !isNaN(id));
  if (ids.length > 0) {
    await quizStore.loadCustomQuestions(ids);

    // Set approval score dynamically
    quizStore.approvalScore = Math.ceil(ids.length / 2);

    quizStarted.value = true;
  } else {
    alert('Please enter valid question IDs separated by commas.');
  }
};

onMounted(async () => {
  if (!quizStore.stateQuestions || Object.keys(quizStore.stateQuestions).length === 0) {
    await quizStore.loadQuestions();
  }
});
</script>
