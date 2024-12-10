<template>
  <div class="hero-body">
    <div class="container has-text-centered">
      <div v-if="!quizStarted" class="box">
        <h2 class="is-size-2 mb-5">Select State for Quiz</h2>
        <div class="select">
          <select v-model="selectedState">
            <option disabled value="">Please select one</option>
            <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
          </select>
        </div>
        <textarea
          v-model="selectedQuestions"
          placeholder="Enter question IDs separated by commas for this state"
          class="textarea mt-5"
        ></textarea>
        <button @click="loadStateQuestions" class="button is-medium mt-5">Start State Quiz</button>
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
                </span>
              </p>
            </li>
          </ul>
          <button @click="resetQuiz" class="button is-medium mt-5">
            Quiz neu starten
          </button>
        </div>

      </div>
      <p class="mt-5" v-if="quizStarted && !quizFinished">
        State Quiz - {{ selectedState }} - {{ remainingQuestions }} questions remaining.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuizStore } from "@/stores/quizStore";

const quizStore = useQuizStore();
const quizStarted = ref(false);
const quizFinished = computed(() => {
  return quizStore.currentQuestionIndex === null && quizStore.results !== null;
});

const states = computed(() =>
  Object.keys(quizStore.stateQuestions).filter((key) => key !== "generalQuestions")
);

const selectedState = ref('');
const currentQuestion = computed(() => quizStore.questions[quizStore.currentQuestionIndex]);
const remainingQuestions = computed(() => quizStore.remainingQuestions);
const selectedQuestions = ref('');


// Function to select a state and load its questions
const selectState = async (state) => {
  // Actualiza el estado del quiz en el store
  quizStore.setState(state);
  
  // Carga las preguntas correspondientes al estado seleccionado
  await quizStore.loadQuestions();

  // Inicia el quiz
  quizStarted.value = true;
};

// Función para manejar la selección de una respuesta
const selectAnswer = (index) => {
  // Actualiza la respuesta seleccionada en el store
  quizStore.selectAnswer(index);
};

// Función para reiniciar el quiz
const resetQuiz = () => {
  // Resetea el estado del quiz en el store
  quizStore.resetQuiz();

  // Marca que el quiz no ha comenzado
  quizStarted.value = false;
};

// Función para cargar las preguntas específicas de un estado
const loadStateQuestions = async () => {
  if (selectedState.value) {
    // Asegúrate de que las preguntas se carguen en el store
    await quizStore.loadQuestions();

    // Filtra las preguntas según los IDs ingresados por el usuario
    const stateSpecificQuestions = quizStore.stateQuestions[selectedState.value];
    const questionIDs = selectedQuestions.value.split(',').map(id => id.trim());
    
    const filteredQuestions = stateSpecificQuestions.filter(q => questionIDs.includes(q.id.toString()));
    quizStore.questions = filteredQuestions.map((question, index) => {
      const shuffledChoices = quizStore.shuffleArray([...question.choices]);
      const originalCorrectChoice = question.choices[question.correct - 1];
      const newCorrectIndex = shuffledChoices.indexOf(originalCorrectChoice);

      return {
        id: index + 1, // Asigna IDs únicos
        ...question,
        choices: shuffledChoices,
        correct: newCorrectIndex,
      };
    });

    // Establece la puntuación de aprobación dinámicamente basada en las preguntas seleccionadas
    quizStore.approvalScore = Math.ceil(filteredQuestions.length / 2);

    // Inicia el quiz
    quizStarted.value = true;
  } else {
    // Muestra un mensaje de alerta si no se selecciona un estado válido
    alert('Please select a valid state.');
  }
};

// Función para contar las respuestas correctas
const correctAnswersCount = computed(() => {
  return quizStore.results.filter(result => result.isCorrect).length;
});

// Hook onMounted para cargar las preguntas del estado al montar el componente
onMounted(async () => {
  if (!quizStore.stateQuestions || Object.keys(quizStore.stateQuestions).length === 0) {
    await quizStore.loadQuestions();
  }
});
</script>

