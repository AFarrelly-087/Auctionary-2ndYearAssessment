<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <label for = "email">Email: </label>
            <input type="email" name="email" v-model = "email"/>
            <div v-show="submitted && !email">Email is required</div>
            <br /><br />

            <label for = "password">Password: </label>
            <input type ="password" name = "password" v-model = "password"/>
            <div v-show="submitted && !password">Password is required</div>
            
            <button type="submit">
                Login
            </button>
        </form>

        <div v-if="error">
            {{ error }}
        </div>

        <br /><br />
    
        
    </div>
</template>
<script>
import { usersService } from '../../services/users.service.js';

export default{
    data(){
        return{
            email: "",
            password: "",
            submitted: false,
            error: ""
        }
    },
    methods: {
        login(e){
            this.submitted = true;
            this.error = "";
            if (!this.email || !this.password) {
                return;
            }
            
            usersService.login(this.email, this.password)
                .then(response => {
                    console.log('Logged in:', response);
                    this.$router.push('/');
                })
                .catch(error => {
                    this.error = `Login failed: ${error}`;
                    console.error('error:', error);
                });
        }
    }
}</script>
<style scoped>
</style>