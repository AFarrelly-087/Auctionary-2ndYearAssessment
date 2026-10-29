<template>
    <div>
        <h1>Search</h1><!--Searches with text input by user-->
        <form @submit.prevent="search">
            <input type="text" name="search" v-model="searchQuery" />
            <br /><br />

            <template v-if="isLoggedIn">
                <label for="bidtype">Filter by your items: </label>
                <select name="status" id="bidtype" v-model="status">
                    <option value="">All Items</option>
                    <option value="OPEN">My Open Items</option>
                    <option value="BID">Items I'm Bidding On</option>
                    <option value="ARCHIVE">My Completed Bids</option>
                </select>
                <br /><br />
            </template>

            <button type="submit">Search</button>
        </form>
        <br /><br />


        <em v-if="loading"></em>
        <!--returns list of items-->
        <ul v-if="items.length">
            <li v-for="item in items" :key="item.item_id">
                <router-link :to="'/item/' + item.item_id">
                    {{ item.name }}
                </router-link>
            </li>
        </ul>

        <div v-if="error">
            {{ error }}
        </div>

    </div>
</template>

<script>
import { coreService } from '../../services/core.service.js';

export default {
    data() {
        return {
            items: [],
            searchQuery: "",
            status: "",
            error: "",
            loading: false
        }
    },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('session_token'); // Checks if logged in
        }
    },
    watch: {
        status() {
            // Automatically search when status filter changes
            this.performSearch();
        }
    },
    mounted() {
        this.performSearch(); //performs search
    },
    methods: {
        search() {
            this.performSearch();//performs search
        },
        performSearch() {
            this.loading = true;
            this.error = "";
            
            coreService.getSearchItems(this.searchQuery, this.status)
                .then(items => {
                    this.items = items || [];
                    this.loading = false;
                })
                .catch(error => {
                    console.error('Search error:', error);
                    if (error.includes && error.includes('Authentication required')) {
                        this.error = `Search failed: Please log in to use status filters`;
                    } else {
                        this.error = `Search failed: ${error}`;
                    }
                    this.loading = false;
                });
        }
    }
}
</script>

<style scoped></style>