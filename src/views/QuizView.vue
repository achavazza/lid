<template>
  <div class="hero-body">
    <div class="container has-text-centered">
      <div v-if="!quizStarted" class="box">
        <h1 class="is-size-2 mb-5">Wählen Sie Ihren Staat</h1>
        <div class="states">
          <button
            v-for="state in states"
            :key="state"
            @click="selectState(state)"
            class="button is-medium mx-1"
          >
            {{ state }}
          </button>
        </div>
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
          <nav class="level">
          <div class="level-item level-left has-text-left">
            <p class="is-size-4">
              <span class="heading">Punktzahl</span><br />
              <span class="title">{{ correctAnswersCount }} / {{ quizStore.questions.length }}</span>
            </p>
          </div>
          <div class="level-item level-left has-text-left">
            <p class="is-size-4">

              <span class="heading">Bestandene (nötig {{ quizStore.approvalScore }})</span><br />
              <span class="title" :class="{ approved: quizStore.isApproved, notApproved: !quizStore.isApproved }">
                {{ quizStore.isApproved ? "Sie haben bestanden!" : "Sie haben nicht bestanden" }}
              </span>
            </p>
          </div>
          <div class="level-item level-left has-text-left">
            <p class="is-size-4">
            <span class="heading">Einbürgerungsprüfung (nötig {{ quizStore.residentApprovalScore }})</span><br />
            <span class="title" :class="{ approved: quizStore.hasResidentApproval, notApproved: !quizStore.hasResidentApproval }">
                {{ quizStore.hasResidentApproval ? "Erreicht!" : "Nicht Erreicht" }}
            </span>  
            </p>  
          </div>
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
          <button @click="resetQuiz" class="button is-medium mt-3">
            Quiz neu starten
          </button>
        </div>

      </div>
      <p class="mt-5" v-if="quizStarted && !quizFinished">
        <span>{{ quizStore.selectedState }}</span> - {{ remainingQuestions }} Fragen verbleiben.
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
      //console.log("Answer selected. Current Index:", quizStore.currentQuestionIndex);
    };

    const resetQuiz = () => {
      quizStore.resetQuiz();
      quizStarted.value = false;
    };

    onMounted(async () => {
      if (!quizStore.stateQuestions || Object.keys(quizStore.stateQuestions).length === 0) {
        await quizStore.loadQuestions();
      }
    });
   
</script>