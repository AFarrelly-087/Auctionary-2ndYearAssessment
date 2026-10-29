<template>
  <div>
    <h1>Auctionary</h1>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/search">Search </router-link>
      
      <template v-if="!isLoggedIn">
        <router-link to="/login">Login</router-link>
        <router-link to="/createaccount">Create Account </router-link>
      </template>
      
      <template v-if="isLoggedIn">
        <router-link to="/profiledetails">Profile</router-link>        <router-link to="/create-item">Create Item</router-link>        <button @click="logout">Logout </button>
      </template>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { usersService } from './services/users.service.js';

export default {
  data() {
    return {
      isLoggedIn: false
    }
  },
  mounted() {
    this.checkLoginStatus();
    window.addEventListener('storage', this.checkLoginStatus);
  },
  unmounted() {
    window.removeEventListener('storage', this.checkLoginStatus);
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('session_token');
    },
    logout() {
      usersService.logout()
        .then(() => {
          console.log('Logout successful');
          this.isLoggedIn = false;
          this.$router.push('/');
        })
        .catch(error => {
          console.error('Logout error:', error);
          localStorage.removeItem('user_id');
          localStorage.removeItem('session_token');
          this.isLoggedIn = false;
          this.$router.push('/');
        });
    }
  },
  watch: {
    '$route'() {
      this.checkLoginStatus();
    }
  }
}
</script>

<style scoped>
</style>