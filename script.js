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

class UserListComponent {
    constructor(userService, onUserSelect) {
        this.userService = userService;
        this.onUserSelect = onUserSelect;
        this.userListElement = document.getElementById('user-list');
        this.searchInput = document.getElementById('search-input');

        this.bindEvents();
    }

    bindEvents() {
        this.searchInput.addEventListener('input', (e) => this.renderUsers(e.target.value));
    }

    async initialize() {
        await this.userService.fetchUsers();
        this.renderUsers();
    }

    renderUsers(searchTerm = '') {
        const users = this.userService.searchUsers(searchTerm);

        this.userListElement.innerHTML = users.map(user => `
                    <div class="user-card" data-user-id="${user.id}">
                        <h3>${user.name}</h3>
                        <p>${user.email}</p>
                        <p>${user.address.street}, ${user.address.city}</p>
                    </div>
                `).join('');

        
    }
}

