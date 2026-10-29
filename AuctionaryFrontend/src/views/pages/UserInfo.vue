<template>
    <div>
        
        <div v-if="loading">
        </div>

        <div v-else-if="error">
            <div>{{ error }}</div>
        </div>

        <div v-else-if="user">
            <h1>{{ user.first_name }} {{ user.last_name }}</h1>
        

            <div><!--Lists all items a user is selling-->
                Items Selling ({{ user.selling ? user.selling.length : 0 }})
                <div v-if="user.selling && user.selling.length">
                    <ul>
                        <li v-for="item in user.selling" :key="item.item_id">
                            <router-link :to="'/item/' + item.item_id">
                                {{ item.name }}
                                <p>{{ item.description.substring(0, 100) }}{{ item.description.length > 100 ? '...' : '' }}</p>
                                <p>End Date:{{ formatDate(item.end_date) }}</p>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    <p>No items currently selling.</p>
                </div>
            </div>

            <div><!--Lists all items a user is bidding on-->
                Bidding On ({{ user.bidding_on ? user.bidding_on.length : 0 }})
                <div v-if="user.bidding_on && user.bidding_on.length">
                    <ul>
                        <li v-for="bid in user.bidding_on" :key="bid.item_id">
                            <router-link :to="'/item/' + bid.item_id">
                                {{bid.name }}
                                <p>{{ bid.description.substring(0, 100) }}{{ bid.description.length > 100 ? '...' : '' }}</p>
                                <p>Current Bid: ${{ bid.amount }}</p>
                                <p>End Date: {{ formatDate(bid.end_date) }}</p>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    <p>Not currently bidding on any items.</p>
                </div>
            </div>

            <div><!--Lists all auctions where the end date has passed-->
                Completed Auctions ({{ user.auctions_ended ? user.auctions_ended.length : 0 }})
                <div v-if="user.auctions_ended && user.auctions_ended.length">
                    <ul>
                        <li v-for="auction in user.auctions_ended" :key="auction.item_id">
                            <router-link :to="'/item/' + auction.item_id">
                                {{ auction.name }}
                                <p>{{ auction.description.substring(0, 100) }}{{ auction.description.length > 100 ? '...' : '' }}</p>
                                <p>Final Price:${{ auction.amount || 'No bids' }}</p>
                                <p>Ended: {{ formatDate(auction.end_date) }}</p>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    <p>No completed auctions.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { usersService } from '../../services/users.service.js';

export default {
    data() {
        return {
            user: null,
            loading: true,
            error: ""
        }
    },
    mounted() {
        this.loadUserInfo();
    },
    methods: {
        loadUserInfo() {//loads user info
            let userId = this.$route.params.userId;
            
            if (!userId) {
                userId = localStorage.getItem('user_id');
                
                if (!userId) {
                    this.error = "Please log in to view profile";
                    this.loading = false;
                    return;
                }
            }
            
            usersService.getUser(userId)
                .then(user => {
                    this.user = user;
                    this.loading = false;
                })
                .catch(error => {
                    this.error = `profile unavailable: ${error}`;
                    this.loading = false;
                });
        },
        formatDate(timestamp) {
            return new Date(timestamp).toLocaleString();
        }
    },
    watch: {
        '$route'() {
            this.loadUserInfo();
        }
    }
}
</script>

<style scoped>
</style>