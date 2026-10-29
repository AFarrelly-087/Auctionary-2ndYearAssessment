<template>
    <div>
        <h3>Questions & Answers</h3>
        
        <div v-if="loading">
        </div>
        
        <div v-else-if="questions.length">
            <!--lists all questions and their answers if applicable-->
            <div v-for="question in questions" :key="question.question_id">
                <div>
                    Q: {{ question.question_text }}
                    <br>
                    <span v-if="question.first_name && question.last_name">
                        Asked by {{ question.first_name }} {{ question.last_name }}
                    </span>
                </div>
                <div v-if="question.answer_text">
                    A: {{ question.answer_text }}
                </div>
                <div v-else>
                    <em>No answer yet</em>
                    <div v-if="canAnswerQuestion">
                        <form @submit.prevent="submitAnswer(question.question_id)">
                            <textarea v-model="answerText" rows="3" required></textarea>
                            <br>
                            <button type="submit" :disabled="submitting">Submit Answer</button>
                        </form>
                    </div>
                </div>
                <hr>
            </div>
        </div>
        
        <div v-else>
            <p>No questions yet.</p>
        </div>

        <div v-if="isLoggedIn && !isOwner">
            <h4>Ask a Question</h4>
            <form @submit.prevent="submitQuestion">
                <textarea v-model="questionText" rows="3" required></textarea>
                <br><br>
                <button type="submit" :disabled="submitting">
                    Ask Question
                </button>
            </form>
            <div v-if="error">
                {{ error }}
            </div>
        </div>
        
        <div v-else-if="!isLoggedIn">
            <p>Please log in to ask questions.</p>
        </div>
    </div>
</template>

<script>
import { questionService } from '../../services/question.service.js';

export default {
    props: {
        itemId: {
            type: [String, Number],
            required: true
        },
        isOwner: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            questions: [],
            loading: true,
            questionText: "",
            submitting: false,
            error: "",
            answerText: ""
        }
    },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('session_token');
        },
        canAnswerQuestion() {//checks if user is item owner
            return this.isLoggedIn && this.isOwner;
        }
    },
    mounted() {
        this.loadQuestions();
    },
    methods: {
        loadQuestions() {//loads all questions for item
            this.loading = true;
            questionService.getItemQuestions(this.itemId)
                .then(response => {
                    console.log('Loaded questions:', response);
                    this.questions = response || [];
                    this.loading = false;
                })
                .catch(error => {
                    console.error('Failed to load:', error);
                    if (error.includes && error.includes('Not Found')) {
                        this.questions = [];
                    }
                    this.loading = false;
                });
        },
        submitQuestion() {//posts question
            if (!this.questionText.trim()) return;
            
            console.log('Submitting:', this.questionText);
            console.log('Item ID:', this.itemId);
            console.log('Session token:', localStorage.getItem('session_token'));
            
            this.submitting = true;
            this.error = "";
            
            questionService.askQuestion(this.itemId, this.questionText)
                .then(result => {
                    console.log('Question submitted:', result);
                    this.questionText = "";
                    return this.loadQuestions();
                })
                .catch(error => {
                    console.error('submission error:', error);
                    this.error = error.message || error || "Question not submitted";
                })
                .finally(() => {
                    this.submitting = false;
                });
        },
        submitAnswer(questionId) {
            console.log('submitAnswer called with questionId:', questionId);
            if (!this.answerText.trim()) return;
            
            this.submitting = true;
            this.error = "";
            
            questionService.answerQuestion(questionId, this.answerText)
                .then(() => {
                    this.answerText = "";
                    return this.loadQuestions();
                })
                .catch(error => {
                    console.error('Answer failed:', error);
                    this.error = error.message || error || "Answer not submitted";
                })
                .finally(() => {
                    this.submitting = false;
                });
        }
    }
}
</script>