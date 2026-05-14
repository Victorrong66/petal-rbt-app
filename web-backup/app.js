// ── Firebase config ───────────────────────────────────────────────────────────
// Replace these values with your own Firebase project credentials.
// Instructions: https://firebase.google.com/docs/web/setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── State ─────────────────────────────────────────────────────────────────────
const NAME_KEY = "petal_display_name";
let   userName = localStorage.getItem(NAME_KEY) || null;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const authScreen     = document.getElementById("auth-screen");
const appScreen      = document.getElementById("app-screen");
const nameInput      = document.getElementById("name-input");
const nameSubmitBtn  = document.getElementById("name-submit-btn");
const newPostBtn     = document.getElementById("new-post-btn");
const signoutBtn     = document.getElementById("signout-btn");
const postModal      = document.getElementById("post-modal");
const modalOverlay   = document.getElementById("modal-overlay");
const modalClose     = document.getElementById("modal-close");
const roseInput      = document.getElementById("rose-input");
const budInput       = document.getElementById("bud-input");
const thornInput     = document.getElementById("thorn-input");
const submitPostBtn  = document.getElementById("submit-post-btn");
const postsContainer = document.getElementById("posts-container");
const feedLoading    = document.getElementById("feed-loading");
const feedEmpty      = document.getElementById("feed-empty");
const userNameDisplay = document.getElementById("user-name-display");

// ── Auth flow ─────────────────────────────────────────────────────────────────
function showApp() {
  authScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  if (userNameDisplay) userNameDisplay.textContent = userName;
  startFeed();
}

function showAuth() {
  appScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
}

if (userName) {
  showApp();
} else {
  showAuth();
}

nameSubmitBtn?.addEventListener("click", () => {
  const val = nameInput?.value.trim();
  if (!val) { showToast("Enter your name first."); return; }
  userName = val;
  localStorage.setItem(NAME_KEY, userName);
  showApp();
});

nameInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") nameSubmitBtn.click();
});

signoutBtn?.addEventListener("click", () => {
  localStorage.removeItem(NAME_KEY);
  userName = null;
  stopFeed();
  postsContainer.innerHTML = "";
  showAuth();
});

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal() {
  postModal.classList.remove("hidden");
  roseInput.focus();
}

function closeModal() {
  postModal.classList.add("hidden");
  roseInput.value  = "";
  budInput.value   = "";
  thornInput.value = "";
}

newPostBtn?.addEventListener("click",    openModal);
modalClose?.addEventListener("click",    closeModal);
modalOverlay?.addEventListener("click",  closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ── Submit post ───────────────────────────────────────────────────────────────
submitPostBtn?.addEventListener("click", async () => {
  const rose  = roseInput.value.trim();
  const bud   = budInput.value.trim();
  const thorn = thornInput.value.trim();

  if (!rose && !bud && !thorn) {
    showToast("Fill in at least one field.");
    return;
  }

  submitPostBtn.disabled    = true;
  submitPostBtn.textContent = "Posting...";

  try {
    await addDoc(collection(db, "posts"), {
      name:      userName,
      rose:      rose  || null,
      bud:       bud   || null,
      thorn:     thorn || null,
      createdAt: serverTimestamp(),
    });
    closeModal();
  } catch (err) {
    console.error(err);
    showToast("Failed to post. Check your connection.");
  } finally {
    submitPostBtn.disabled    = false;
    submitPostBtn.textContent = "Share with your crew";
  }
});

// ── Live feed ─────────────────────────────────────────────────────────────────
let unsubscribe = null;

function startFeed() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  unsubscribe = onSnapshot(q, (snapshot) => {
    feedLoading.classList.add("hidden");

    if (snapshot.empty) {
      feedEmpty.classList.remove("hidden");
      postsContainer.innerHTML = "";
      return;
    }

    feedEmpty.classList.add("hidden");
    postsContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      postsContainer.appendChild(buildCard(data));
    });
  }, (err) => {
    console.error(err);
    feedLoading.textContent = "Failed to load posts.";
  });
}

function stopFeed() {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
}

// ── Card builder ──────────────────────────────────────────────────────────────
function buildCard(data) {
  const card = document.createElement("div");
  card.className = "post-card";

  const initial = (data.name || "?")[0].toUpperCase();
  const dateStr = data.createdAt
    ? new Date(data.createdAt.seconds * 1000).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "Just now";

  let segments = "";

  if (data.rose) segments += segment("🌹", "rose",  "Rose",  data.rose);
  if (data.bud)  segments += segment("🌱", "bud",   "Bud",   data.bud);
  if (data.thorn) segments += segment("🥀", "thorn", "Thorn", data.thorn);

  card.innerHTML = `
    <div class="post-meta">
      <div class="post-avatar-placeholder">${initial}</div>
      <div>
        <div class="post-author">${escHtml(data.name || "Anonymous")}</div>
        <div class="post-date">${dateStr}</div>
      </div>
    </div>
    ${segments}
  `;

  return card;
}

function segment(icon, cls, label, text) {
  return `
    <div class="post-segment">
      <span class="segment-icon">${icon}</span>
      <div class="segment-body">
        <div class="segment-label ${cls}">${label}</div>
        <div class="segment-text">${escHtml(text)}</div>
      </div>
    </div>`;
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className   = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
