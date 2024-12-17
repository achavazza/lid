<template>
    <div class="hero-body">
        <div class="container has-text-centered">
            <div class="box">
                <h2 class="is-size-2 mb-5">All Questions</h2>
                <ul class="has-text-left">
                    <!-- Display general questions -->
                    <li v-for="(question, index) in allQuestions" :key="index" class="mb-5">
                        <div class="level mb-0">
                            <div class="level-item level-left">
                                <h4 class="is-size-5 has-text-weight-semibold breakline">{{ question.question }}</h4>
                            </div>
                            <div class="level-item level-right">
                                <h4 class="is-size-5 has-text-grey-lighter has-text-weight-semibold">{{ question.id }}</h4>
                            </div>
                        </div>
                        <img v-if="question.image" :src="question.image" alt="Question Image" class="question-image" />
                        
                        <!--<p>Correct Answer: {{ question.choices[question.correct] }}</p>-->
                        <ul>
                            <li v-for="(choice, idx) in question.choices" :key="idx" class="mb-1" :class="idx+1 == question.correct ? 'approved' : 'normal' ">
                                {{ choice }}
                                <!--<span class="correct" v-if="idx+1 == question.correct">Richtig</span>-->
                            </li>
                        </ul>
                    </li>
                    <!-- Display state-specific questions -->
                    <li v-for="(questions, stateName) in stateQuestions" :key="stateName">
                        <h3 class="is-size-3 has-text-weight-bold">{{ stateName }}</h3>
                        <ul>
                            <li v-for="(question, index) in questions" :key="index" class="mb-5">
                                <div class="level mb-0">
                                    <div class="level-item level-left" style="max-width:60%">
                                        <h4 class="is-size-5 has-text-weight-semibold breakline">{{ question.question }}</h4>
                                    </div>
                                    <div class="level-item level-right">
                                        <h4 class="is-size-5 has-text-grey-lighter has-text-weight-semibold">{{ stateName + ' ' + question.id }}</h4>
                                    </div>
                                </div>
                                <img v-if="question.image" :src="question.image" alt="Question Image" class="question-image" />
                                <!--<p>Correct Answer: {{ question.choices[question.correct] }}</p>-->
                                <ul v-if="question.id == 301 || question.id == 303 || question.id == 304 || question.id == 308" class="is-flex">
                                    <li v-for="(choice, idx) in question.choices" :key="idx" class="mb-1 mx-2" :class="idx+1 == question.correct ? 'approved' : 'normal' ">
                                        {{ choice }} 
                                        <!--<span class="correct" v-if="idx+1 == question.correct">Richtig</span>-->
                                    </li>
                                </ul>
                                <ul v-else>
                                    <li v-for="(choice, idx) in question.choices" :key="idx" class="mb-1" :class="idx+1 == question.correct ? 'approved' : 'normal' ">
                                        {{ choice }} 
                                        <!--<span class="correct" v-if="idx+1 == question.correct">Richtig</span>-->
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useQuizStore } from '@/stores/quizStore';

const quizStore = useQuizStore();
const allQuestions = ref([]);
const stateQuestions = ref({});

onMounted(async () => {
    await quizStore.loadAllQuestions();
    // Store all questions in order
    allQuestions.value = quizStore.generalQuestions;
    // Assign state-specific questions
    stateQuestions.value = quizStore.stateQuestions;
});
</script>
