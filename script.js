class UserService {
    constructor() {
        this.users = [];
    }

    async fetchUsers() {
        try {
            const response = await fetch('users.json');
            this.users = await response.json();
            return this.users;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    searchUsers(term) {
        term = term.toLowerCase();
        return this.users.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        );
    }
}

