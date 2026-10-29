<template>
    <div>
        <h1>Create Account</h1>
        <form @submit.prevent="createAccount">
            <label for = "firstname">First name: </label>
            <input type = "text" name="firstname" v-model="first_name"> 
            <div v-show="submitted && !first_name">First name is required</div>
            <br /><br />
            
            <label for = "lastname">Last name: </label>
            <input type = "text" name="lastname" v-model="last_name"> 
            <div v-show="submitted && !last_name">Last name is required</div>
            <br /><br />
            
            <label for = "email">Email: </label>
            <input type="email" name="email" v-model = "email"/>
            <div v-show="submitted && !email">Email is required</div>
            <div v-show="submitted && email && !isValidEmail">Please enter a valid email</div>
            <br /><br />

            <label for = "password">Password: </label>
            <input type ="password" name = "password" v-model = "password"/>
            <div v-show="submitted && !password">Password is required</div>
            <div v-show="submitted && password && !isValidPassword">
                Password must be 8-30 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$&*)
            </div>
            
            <button type="submit">Create Account</button>
        </form>

        <div v-if="error">
            {{ error }}
        </div>

        <br /><br />
    
        
    </div>
</template>
<script>
import EmailValidator from 'email-validator';
import {usersService} from '../../services/users.service';

export default{
    data(){
        return{
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            submitted: false,
            error: ""
        }
    },
    computed: {
        isValidEmail() {
            return EmailValidator.validate(this.email);
        },
        isValidPassword() {//checks if password is strong enough
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$/;
            return passwordRegex.test(this.password);
        }
    },
    methods: {
        createAccount() {
            this.submitted = true;
            this.error = "";
            if (!this.first_name || !this.last_name || !this.email || !this.password) {//checks if any missing fields
                return;
            }
            
            if (!this.isValidEmail) {//makes sure email and password are valid
                return;
            }
            
            if (!this.isValidPassword) {
                return;
            }
            
            usersService.createAccount(this.first_name, this.last_name, this.email, this.password)
                .then(response => {
                    console.log('Account created:', response);
                    
                    return usersService.login(this.email, this.password);
                })
                .then(loginResponse => {
                    console.log('Logged in:', loginResponse);
                    this.$router.push('/');
                })
                .catch(error => {
                    this.error = `Account creation failed: ${error}`;
                    console.error('Create account error:', error);
                });
        }
    }
}</script>
<style scoped>
</style>