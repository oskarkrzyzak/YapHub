function getTimeLeft(expiresAt) {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires - now;
  if (diffMs <= 0) return 'Expired';
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;
  if (diffMins < 1) return '< 1m';
  if (diffMins < 60) return diffMins + 'm';
  return diffHours + 'h ' + String(remainingMins).padStart(2, '0') + 'min';
}

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        first_name: document.getElementById("firstname")?.value.trim(),
        last_name: document.getElementById("lastname")?.value.trim(),
        nickname: document.getElementById("nickname")?.value.trim(),
        email: document.getElementById("email")?.value.trim(),
        password: document.getElementById("password")?.value
      };
      try {
        const res = await fetch("/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          alert("Account created! Please log in.");
          window.location.href = "index.html";
        } else {
          const msg = await res.text();
          alert("Sign up failed: " + msg);
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("loginEmail")?.value.trim();
      const password = document.getElementById("loginPassword")?.value;
      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem('user_id', data.user.user_id);
          sessionStorage.setItem('nickname', data.user.nickname);
          window.location.href = "feed.html";
        } else {
          alert("Wrong email or password");
        }
      } catch (err) {
        alert("Network error: " + err.message);
      }
    });
  }

  const feedContent = document.querySelector('.feed-content');
  if (feedContent) {
    fetch('/posts')
      .then(res => res.json())
      .then(posts => {
        posts.forEach(post => {
          const postCard = document.createElement('div');
          postCard.className = 'post-card';
          postCard.dataset.postId = post.post_id;
          postCard.innerHTML = `
            <div class="post-header">
              <div class="post-header-left">
                <span class="post-nickname">${post.nickname}</span>
              </div>
              <div class="post-header-right">
                <span class="post-time">${getTimeLeft(post.expires_at)}</span>
              </div>
            </div>
            <div class="post-body">
              <p class="post-text">${post.content}</p>
            </div>
            <div class="post-actions">
              <button class="post-action-btn">👍 Like</button>
              <button class="post-action-btn comment-toggle-btn">💬 Comment</button>
            </div>
            <div class="comments-section" style="display: none;">
              <div class="comments-list"></div>
              <div class="comment-input-row">
                <input type="text" class="comment-input" placeholder="Write a comment...">
                <button class="submit-comment-btn">Post</button>
              </div>
              <p class="comment-message"></p>
            </div>
          `;
          feedContent.appendChild(postCard);
          wireUpComments(postCard, post.post_id);
        });

        setInterval(() => {
          const timeSpans = document.querySelectorAll('.post-time');
          posts.forEach((post, index) => {
            if (timeSpans[index]) {
              timeSpans[index].textContent = getTimeLeft(post.expires_at);
            }
          });
        }, 60000);
      })
      .catch(err => console.error('Error loading posts:', err));
  }
});

function wireUpComments(postCard, postId) {
  const toggleBtn = postCard.querySelector('.comment-toggle-btn');
  const commentsSection = postCard.querySelector('.comments-section');
  const commentsList = postCard.querySelector('.comments-list');
  const commentInput = postCard.querySelector('.comment-input');
  const submitBtn = postCard.querySelector('.submit-comment-btn');
  const commentMessage = postCard.querySelector('.comment-message');

  async function loadComments() {
    try {
      const res = await fetch(`/posts/${postId}/comments`);
      const comments = await res.json();
      commentsList.innerHTML = '';
      if (comments.length === 0) {
        commentsList.innerHTML = '<p>No comments yet.</p>';
        return;
      }
      comments.forEach(comment => {
        const p = document.createElement('p');
        p.textContent = comment.content;
        commentsList.appendChild(p);
      });
    } catch (err) {
      commentMessage.textContent = 'Error loading comments.';
    }
  }

  toggleBtn.addEventListener('click', async () => {
    const isHidden = commentsSection.style.display === 'none';
    commentsSection.style.display = isHidden ? 'block' : 'none';
    if (isHidden) await loadComments();
  });

  submitBtn.addEventListener('click', async () => {
    const content = commentInput.value.trim();
    const userId = sessionStorage.getItem('user_id');
    if (!content) {
      commentMessage.textContent = 'Comment cannot be empty.';
      return;
    }
    if (!userId) {
      commentMessage.textContent = 'You must be logged in to comment.';
      return;
    }
    try {
      const res = await fetch('/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, user_id: userId, content })
      });
      const result = await res.json();
      if (result.success) {
        commentInput.value = '';
        commentMessage.textContent = '';
        await loadComments();
      } else {
        commentMessage.textContent = result.message || 'Error adding comment.';
      }
    } catch (err) {
      commentMessage.textContent = 'Network error.';
    }
  });
}