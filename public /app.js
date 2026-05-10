const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user;

const API_URL = "https://spck-xgzq.onrender.com";

let currentUser = null;

// ---------------- LOGIN + REF ----------------

async function login() {

    if (!user) return;

    try {

        const startParam =
            Telegram.WebApp.initDataUnsafe.start_param;

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegramId: user.id,
                name: user.first_name,
                ref: startParam || null
            })
        });

        currentUser = await res.json();

        updateUI();

    } catch (err) {

        console.log(err);
    }
}

// ---------------- UPDATE UI ----------------

function updateUI() {

    if (!currentUser) return;

    const username =
        document.getElementById("username");

    const points =
        document.getElementById("points");

    if (username) {
        username.innerText = currentUser.name;
    }

    if (points) {
        points.innerText = currentUser.points;
    }
}

// ---------------- DAILY CLAIM ----------------

async function claimDaily() {

    try {

        const res = await fetch(`${API_URL}/daily`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegramId: currentUser.telegramId
            })
        });

        const data = await res.json();

        alert(data.message);

        if (data.user) {

            currentUser = data.user;

            updateUI();
        }

    } catch (err) {

        console.log(err);
    }
}

// ---------------- INVITE SYSTEM ----------------

function inviteFriends() {

    if (!currentUser) return;

    const botUsername = "Myatt_205bot";

    const refLink =
        `https://t.me/${botUsername}?start=${currentUser.telegramId}`;

    const text =
        `Join Myat Digital Shop and earn rewards!\n${refLink}`;

    Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`
    );
}

// ---------------- WITHDRAW ----------------

async function withdraw(points, wallet) {

    try {

        const res = await fetch(`${API_URL}/withdraw`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegramId: currentUser.telegramId,
                points,
                wallet
            })
        });

        const data = await res.json();

        alert(data.message);

        if (data.user) {

            currentUser = data.user;

            updateUI();
        }

    } catch (err) {

        console.log(err);
    }
}

// ---------------- SHOP ORDER ----------------

async function buyProduct(product, price) {

    try {

        const res = await fetch(`${API_URL}/buy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telegramId: currentUser.telegramId,
                product,
                price
            })
        });

        const data = await res.json();

        alert(data.message);

        if (data.user) {

            currentUser = data.user;

            updateUI();
        }

    } catch (err) {

        console.log(err);
    }
}

// ---------------- START ----------------

login();
