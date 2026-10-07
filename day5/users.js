const loadUsersButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusMessage = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

let users = [];

function createDetail(label, value) {
    const paragraph = document.createElement("p");

    const labelElement = document.createElement("strong");
    labelElement.textContent = `${label}: `;

    const valueElement = document.createElement("span");
    valueElement.textContent = value;

    paragraph.append(labelElement, valueElement);

    return paragraph;
}

function renderUsers(list) {
    usersList.replaceChildren();

    if (list.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No users match your filter.";
        usersList.append(message);
        return;
    }

    list.forEach((user) => {
        const listItem = document.createElement("li");

        const nameHeading = document.createElement("h2");
        nameHeading.textContent = user.name;

        const email = createDetail("Email", user.email);
        const city = createDetail("City", user.address.city);
        const company = createDetail("Company", user.company.name);

        listItem.append(nameHeading, email, city, company);
        usersList.append(listItem);
    });
}

async function loadUsers() {
    statusMessage.textContent = "Loading users...";
    loadUsersButton.disabled = true;

    try {
        const response = await fetch(USERS_URL);

        if (!response.ok) {
            throw new Error(
                `Request failed with status ${response.status}.`
            );
        }

        users = await response.json();

        filterInput.value = "";
        renderUsers(users);

        statusMessage.textContent =
            `Successfully loaded ${users.length} users.`;
    } catch (error) {
        users = [];
        usersList.replaceChildren();

        statusMessage.textContent =
            "Unable to load users. Please try again.";

        console.error("Failed to load users:", error);
    } finally {
        loadUsersButton.disabled = false;
    }
}

loadUsersButton.addEventListener("click", () => {
    loadUsers();
});

filterInput.addEventListener("input", () => {
    const filterText = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(filterText)
    );

    renderUsers(filteredUsers);
});
``