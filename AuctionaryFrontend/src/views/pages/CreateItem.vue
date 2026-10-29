<template>
    <div>
        <h1>Create New Auction Item</h1>
        <form @submit.prevent="createItem">
            <label for="name">Item Name:</label>
            <input type="text" name="name" v-model="name" required/>
            <div v-show="submitted && !name">Item name is required</div>
            <br /><br />

            <label for="description">Description:</label>
            <textarea name="description" v-model="description" rows="4" required></textarea>
            <div v-show="submitted && !description">Description is required</div>
            <br /><br />

            <label for="starting_bid">Starting Bid:</label>
            <input type="number" name="starting_bid" v-model.number="starting_bid" min="0" step="0.01" required/>
            <div v-show="submitted && !starting_bid">Starting bid is required</div>
            <br /><br />

            <label for="end_date">End Date:</label>
            <input type="datetime-local" name="end_date" v-model="end_date" required/>
            <div v-show="submitted && !end_date">End date is required</div>
            <div v-show="submitted && end_date && !isValidEndDate">End date must be in the future</div>
            <br /><br />

            <button type="submit">Create Item</button>
        </form>

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
            name: "",
            description: "",
            starting_bid: null,
            end_date: "",
            submitted: false,
            error: ""
        }
    },
    computed: {
        isValidEndDate() {
            if (!this.end_date) return false;
            const selectedDate = new Date(this.end_date);
            const now = new Date();
            return selectedDate > now;
        }
    },
    methods: {
        createItem() {
            this.submitted = true;
            this.error = "";
            //checks if all fields are input correctily
            if (!this.name || !this.description || !this.starting_bid || !this.end_date) {
                return;
            }

            if (!this.isValidEndDate) {
                return;
            }
            //gets the end date
            const endDateTimestamp = new Date(this.end_date).getTime();

            coreService.createItem(this.name, this.description, this.starting_bid, endDateTimestamp)
                .then(response => {
                    console.log('Item created:', response);
                    this.$router.push('/');
                })
                .catch(error => {
                    this.error = `Failed to create item: ${error}`;
                    console.error('Create item error:', error);
                });
        }
    }
}
</script>

<style scoped>

</style>