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

        this.userListElement.querySelectorAll('.user-card').forEach(card => {
            card.addEventListener('click', () => {
                const userId = card.getAttribute('data-user-id');
                const user = this.userService.users.find(u => u.id === parseInt(userId));
                this.onUserSelect(user);
            });
        });
    }
}

class UserDetailComponent {
    constructor() {
        this.userDetailElement = document.getElementById('user-detail');
        this.overlayElement = document.getElementById('overlay');
    }

    showUserDetail(user) {
        this.userDetailElement.innerHTML = `
                    <span class="close-btn">&times;</span>
                    <h2>${user.name}</h2>
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Website:</strong> ${user.website}</p>
                    
                    <h3>Address</h3>
                    <p>${user.address.street}, ${user.address.suite}</p>
                    <p>${user.address.city}, ${user.address.zipcode}</p>
                    
                    <h3>Company</h3>
                    <p><strong>${user.company.name}</strong></p>
                    <p>${user.company.catchPhrase}</p>
                `;

        this.userDetailElement.style.display = 'block';
        this.overlayElement.style.display = 'block';

        const closeBtn = this.userDetailElement.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.hideUserDetail());

        this.overlayElement.addEventListener('click', () => this.hideUserDetail());
    }

    hideUserDetail() {
        this.userDetailElement.style.display = 'none';
        this.overlayElement.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userService = new UserService();
    const userDetailComponent = new UserDetailComponent();
    const userListComponent = new UserListComponent(
        userService,
        (user) => userDetailComponent.showUserDetail(user)
    );

    userListComponent.initialize();
});