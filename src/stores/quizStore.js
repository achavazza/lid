import { defineStore } from "pinia";

export const useQuizStore = defineStore("quiz", {
    state: () => ({
        questions: [], // The randomly selected questions
        generalQuestions: [], // The full pool of general questions
        stateQuestions: {}, // State-specific questions
        currentQuestionIndex: null, // Index of the current question
        selectedAnswers: {}, // User-selected answers
        results: null, // Results after the quiz ends
        pickedQuestions: 5, // Default number of picked general questions
        pickedStateQuestions: 2, // Default number of picked state questions
        approvalScore: 3, // Minimum score to pass
        residentApprovalScore: 5, // Minimum score for resident approval
        selectedState: "Bavaria", // State selected by the user
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
        remainingQuestions(state) {
            // Calculate remaining questions dynamically
            return state.questions.length - state.currentQuestionIndex - 1;
        },
    },
    actions: {
        async loadQuestions() {
            try {
                /* 
                //cargo las preguntas desde un archivo json
                {
                    "generalQuestions": [// preguntas generales ],
                    "State1": [// preguntas específicas de State1 ],
                    "State2": [// preguntas específicas de State2 ]
                } 
                */
                const response = await fetch("/src/questions.json");
                const data = await response.json();

                //asigno a una variable
                this.generalQuestions = data.generalQuestions;

                //con los estados es mas complicado hay que armar un objeto 
                //para leer todas las preguntas de ese estado y pasar a otra variable
                this.stateQuestions = Object.keys(data)
                    .filter((key) => key !== "generalQuestions")
                    .reduce((acc, key) => {
                        acc[key] = data[key];
                        return acc;
                    }, {});

                console.log("Selected State:", this.selectedState);

                // Check if `selectedState` is set and load state-specific questions
                /*
                const stateSpecificQuestions = this.selectedState && this.stateQuestions[this.selectedState] ? 
                        this.getRandomSubset( this.stateQuestions[this.selectedState], Math.min( this.pickedStateQuestions, this.stateQuestions[this.selectedState].length ) )
                        : [];
                */
                let stateSpecificQuestions = [];
                if (this.selectedState && this.stateQuestions[this.selectedState]) {
                    const questionsForState = this.stateQuestions[this.selectedState];
                    const numberOfQuestions = Math.min(this.pickedStateQuestions, questionsForState.length);
                    stateSpecificQuestions = this.getRandomSubset(questionsForState, numberOfQuestions);
                }

                console.log('stateSpecificQuestions',stateSpecificQuestions);

                // Select general questions
                const selectedGeneralQuestions = this.getRandomSubset(
                    this.generalQuestions,
                    Math.min(this.pickedQuestions, this.generalQuestions.length)
                );

                console.log(
                    `General Questions: ${selectedGeneralQuestions.length}, ` +
                    `State Questions: ${stateSpecificQuestions.length}, ` +
                    `Total Questions: ${selectedGeneralQuestions.length + stateSpecificQuestions.length}`
                );

                //aca se combinan las preguntas generales y las del estado
                this.questions = [...selectedGeneralQuestions, ...stateSpecificQuestions];

                //aca se randomizan las respeustas apra dicha pregunta
                
                this.questions = this.questions.map((question, index) => {
                    const shuffledChoices = this.shuffleArray([...question.choices]);
                    const originalCorrectChoice = question.choices[question.correct - 1];
                    const newCorrectIndex = shuffledChoices.indexOf(originalCorrectChoice);

                    return {
                        id: index + 1, // Assign unique IDs
                        ...question,
                        choices: shuffledChoices,
                        correct: newCorrectIndex,
                    };
                });

                this.currentQuestionIndex = 0; // Start the quiz
            } catch (error) {
                console.error("Failed to load questions:", error);
            }
        },
        async loadCustomQuestions(ids) {
            try {
                //cargo el json
                const response = await fetch("/src/questions.json");
                const data = await response.json();

                this.generalQuestions = data.generalQuestions;

                //cargo en el state solo las preguntas elegidas
                const filteredQuestions = this.generalQuestions.filter((question) =>
                    ids.includes(question.id)
                );

                //cargo las preguntas al azar para mostrar
                this.questions = filteredQuestions.map((question, index) => {
                    const shuffledChoices = this.shuffleArray([...question.choices]);
                    const originalCorrectChoice = question.choices[question.correct - 1];
                    const newCorrectIndex = shuffledChoices.indexOf(originalCorrectChoice);

                    return {
                        id: index + 1, // Assign unique IDs
                        ...question,
                        choices: shuffledChoices,
                        correct: newCorrectIndex,
                    };
                });

                this.currentQuestionIndex = 0; // Start the quiz
                console.log(`Custom Questions Loaded: ${this.questions.length}`);
            } catch (error) {
                console.error("Failed to load custom questions:", error);
            }
        }, 
        // Function to load all questions (general and state-specific)
        async loadAllQuestions(){
            try {
                const response = await fetch("/src/questions.json");
                const data = await response.json();
                
                //asigno a una variable
                this.generalQuestions = data.generalQuestions;
                // Assign state-specific questions
                this.stateQuestions = {};
                for (const [state, questions] of Object.entries(data)) {
                    if (state !== "generalQuestions") {
                        this.stateQuestions[state] = questions;
                    }
                }
            } catch {
                console.log('Some error');
            }
            
        },
        //shufflearray randomiza claves en un array
        shuffleArray(array) {
            // Fisher-Yates shuffle algorithm
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
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
                this.currentQuestionIndex = null; // Mark quiz as finished
            }
        } ,
        calculateResults() {
            this.results = this.questions.map((question) => {
                const userAnswer = this.selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correct; // Correct index is now aligned with shuffled choices
                return { question, userAnswer, isCorrect };
            });
        },
        setState(state) {
            this.selectedState = state; // Set the selected state
        },
        resetQuiz() {
            this.questions = [];
            this.currentQuestionIndex = null;
            this.selectedAnswers = {};
            this.results = null;

            // Ensure state selection persists
            console.log("Resetting quiz with selected state:", this.selectedState);

            this.loadQuestions(); // Reload questions with the current state
        },
    },
});
