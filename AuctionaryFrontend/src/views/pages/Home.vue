<template>
    <div>
        <h1>Home</h1>
        <!--lists all items-->
        <em v-if="loading"></em>

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
            error: "",
            loading: true
        }
    },
    mounted() {
        coreService.getSearchItems()
            .then(items => {
                this.items = items || [];
                this.loading = false;
            })
            .catch(error => {
                this.error = `Failed to fetch items: ${error}`;
                this.loading = false;
                console.error('API Error:', error);
            });
    }

}

</script>

<style scoped>
</style>