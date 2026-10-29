<template>
    <div>
        
        <div v-if="loading">
        </div>

        <div v-else-if="error">
            <div>{{ error }}</div>
        </div>

        <div v-else-if="item">
            <h1>{{ item.name }}</h1><!--shows item info-->
            <div>
                <p>Description: {{ item.description }}</p>
                <p>End Date: {{ formatDate(item.end_date) }}</p>
                <p>Created by: 
                    <router-link :to="'/user/' + item.creator_id">{{ item.first_name }} {{ item.last_name }}</router-link>
                </p>
            </div>

            <div> <!--shows past bids-->
                <h3>Bid History</h3>
                <div v-if="bidLoading">
                </div>
                <div v-else-if="bids.length">
                    <ul>
                        <li v-for="bid in bids" :key="bid.bid_id">
                            {{ bid.amount }} by {{ bid.first_name }} {{ bid.last_name }} 
                            at {{ formatDate(bid.timestamp) }}
                        </li>
                    </ul>
                </div>
                <div v-else>
                    <p>No bids yet.</p>
                </div>
            </div>

            <div v-if="isLoggedIn">
                <h3>Place a Bid</h3>
                <form @submit.prevent="submitBid">
                    <label for="bidAmount">Bid Amount:</label>
                    <input type="number" name="bidAmount" v-model.number="bidAmount" min="1" step="1" required/>
                    <div v-show="bidSubmitted && !bidAmount">Bid amount is required</div>
                    <div v-show="bidSubmitted && bidAmount && !isValidBidAmount">Bid must be higher than current highest bid</div>
                    <br /><br />
                    <button type="submit" :disabled="bidLoading">
                        Place Bid
                    </button>
                </form>
                <div v-if="bidError">
                    {{ bidError }}
                </div>
            </div>
            <div v-else>
                <p>Please log in to place a bid.</p>
            </div>

            <Questions 
                :itemId="$route.params.id" 
                :isOwner="isItemOwner"
            />
        </div>
    </div>
</template>

<script>
import { coreService } from '../../services/core.service.js';
import Questions from '../components/Questions.vue';

export default {
    components: {
        Questions
    },
    data() {
        return {
            item: null,
            bids: [],
            loading: true,
            bidLoading: false,
            error: "",
            bidAmount: null,
            bidError: "",
            bidSubmitted: false
        }
    },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('session_token');
        },
        highestBid() {//gets highest bid
            if (!this.bids || this.bids.length === 0) return 0;
            return Math.max(this.bids.map(bid => bid.amount));
        },
        isValidBidAmount() {//checks if bid is higher than currnt max bid
            return this.bidAmount > this.highestBid;
        },
        isItemOwner() {//checks if user is creater of item
            const currentUserId = localStorage.getItem('user_id');
            return currentUserId && this.item && currentUserId == this.item.creator_id;
        }
    },
    mounted() {
        this.loadItemDetails();
        this.loadBidHistory();
    },
    methods: {
        loadItemDetails() {
            const itemId = this.$route.params.id;
            coreService.getOneItem(itemId)
                .then(item => {
                    this.item = item;
                    this.loading = false;
                })
                .catch(error => {
                    this.error = `Item not found: ${error}`;
                    this.loading = false;
                    console.error('Error:', error);
                });
        },
        loadBidHistory() {//gets past bids
            const itemId = this.$route.params.id;
            this.bidLoading = true;
            coreService.getBidHistory(itemId)
                .then(bids => {
                    this.bids = bids || [];
                    this.bidLoading = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.bidLoading = false;
                });
        },
        submitBid() {//posts bid
            this.bidSubmitted = true;
            
            if (!this.bidAmount) {
                this.bidError = "Please enter a bid amount";
                return;
            }
            
            if (this.bidAmount <= this.highestBid) {
                this.bidError = `Bid must be higher than current highest bid of ${this.highestBid}`;
                return;
            }

            this.bidLoading = true;
            this.bidError = "";

            coreService.makeBid(this.$route.params.id, this.bidAmount)
                .then(() => {
                    return this.loadBidHistory();
                })
                .then(() => {
                    this.bidAmount = null;
                    this.bidSubmitted = false;
                })
                .catch(error => {
                    this.bidError = error.message || "Failed to place bid";
                    console.error('Error:', error); 
                })
                .finally(() => {
                    this.bidLoading = false;
                });
        },
        formatDate(timestamp) {//formats unix time to readable date
            return new Date(timestamp).toLocaleString();
        }
    }
}
</script>

<style scoped>
</style>