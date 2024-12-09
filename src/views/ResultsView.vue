<template>
    <div class="hero-body">
        <div class="container has-text-centered">
            <div class="box">
                <h1 class="is-size-2 has-text-centered mb-5">Quiz Results</h1>
                <h2 class="is-size-4">
                    Correct Answers: {{ quizStore.correctAnswersCount }} / {{ quizStore.pickedQuestions + quizStore.pickedStateQuestions }}
                </h2>
                <p class="is-size-5" :class="{ approved: quizStore.isApproved, notApproved: !quizStore.isApproved }">
                    {{ quizStore.isApproved ? "You Passed!" : "You Did Not Pass" }}
                </p>
                <p class="is-size-5"
                    :class="{ approved: quizStore.hasResidentApproval, notApproved: !quizStore.hasResidentApproval }">
                    {{ quizStore.hasResidentApproval ? "Resident Approval Achieved!" : "Resident Approval Not Achieved"
                    }}
                </p>
                <ul>
                    <li v-for="result in quizStore.results" :key="result.question.id" class="mb-3">
                        <h3>{{ result.question.question }}</h3>
                        <p>Your Answer: {{ result.question.choices[result.userAnswer] }}</p>
                        <p>Correct Answer: {{ result.question.choices[result.question.correct] }}</p>
                        <p :class="{ correct: result.isCorrect, incorrect: !result.isCorrect }">
                            {{ result.isCorrect ? "Correct" : "Incorrect" }}
                        </p>
                    </li>
                </ul>
                <button class="button is-large mt-5" @click="goHome">Restart Quiz</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useQuizStore } from "@/stores/quizStore";
import { useRouter } from "vue-router";

export default {
    setup() {
        const quizStore = useQuizStore();
        const router = useRouter();

        const goHome = () => {
            quizStore.resetQuiz();
            router.push("/");
        };

        return {
            quizStore,
            goHome,
        };
    },
};
</script>

<style>
.correct {
    color: green;
}

.incorrect {
    color: red;
}

.approved {
    color: green;
    font-weight: bold;
}

.notApproved {
    color: red;
    font-weight: bold;
}
</style>
