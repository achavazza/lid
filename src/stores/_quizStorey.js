import { defineStore } from "pinia";

export const useQuizStore = defineStore("quiz", {
    state: () => ({
        questions: [], // The randomly selected questions
        allQuestions: [], // The full pool of questions
        currentQuestionIndex: null, // Index of the current question
        selectedAnswers: {}, // User-selected answers
        results: null, // Results after the quiz ends
        pickedQuestions: 2, // Default number of picked questions
        approvalScore: 1, // Minimum score to pass
        residentApprovalScore: 2, // Minimum score for resident approval
    }),
    getters: {
        correctAnswersCount(state) {
            return state.results
                ? state.results.filter((result) => result.isCorrect).length
                : 0;
        },
        isApproved(state) {
            return state.correctAnswersCount >= state.approvalScore;
        },
        hasResidentApproval(state) {
            return state.correctAnswersCount >= state.residentApprovalScore;
        },
    },
    actions: {
        async loadQuestions() {
            try {
                const response = await fetch("/src/questions.json");
                const data = await response.json();

                this.allQuestions = data; // Store the full pool of questions
                this.questions = this.getRandomSubset(this.allQuestions, this.pickedQuestions); // Pick random questions
                this.currentQuestionIndex = 0; // Start with the first question
            } catch (error) {
                console.error("Failed to load questions:", error);
            }
        },
        getRandomSubset(array, count) {
            const shuffled = array.sort(() => Math.random() - 0.5); // Shuffle the array
            return shuffled.slice(0, count); // Take the first `count` items
        },
        selectAnswer(answerIndex) {
            const currentQuestion = this.questions[this.currentQuestionIndex];
            if (currentQuestion) {
                this.selectedAnswers[currentQuestion.id] = answerIndex;
                this.nextQuestion();
            }
        },
        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
            } else {
                this.calculateResults();
            }
        },
        calculateResults() {
            this.results = this.questions.map((question) => {
                const userAnswer = this.selectedAnswers[question.id];
                // Adjust for 1-based indexing in the JSON
                const correctAnswerIndex = question.correct - 1;
                const isCorrect = userAnswer === correctAnswerIndex;
                return { question, userAnswer, isCorrect };
            });
        },
        resetQuiz() {
            this.questions = [];
            this.currentQuestionIndex = null;
            this.selectedAnswers = {};
            this.results = null;
            this.questions = this.getRandomSubset(this.allQuestions, this.pickedQuestions); // Pick a new random set
        },
    },
});
