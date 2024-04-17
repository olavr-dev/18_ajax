const loadCommentsBtnElement = document.getElementById('load-comments-btn');
const commentsSectionElement = document.getElementById('comments');
const commentsSectionParagraphElement = document.querySelector('#comments p');
const commentsFormElement = document.querySelector('#comments-form form');
const commentTitleElement = document.getElementById('title');
const commentTextElement = document.getElementById('text');
const commentErrorElement = document.getElementById('comment-error');

function createCommentsList(comments) {
  const commentListElement = document.createElement('ol');

  for (const comment of comments) {
    const commentElement = document.createElement('li');
    commentElement.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p>${comment.text}</p>
    </article>
    `;
    commentListElement.appendChild(commentElement);
  }

  return commentListElement;
}

async function fetchCommentsForPost(event) {
  const postId = loadCommentsBtnElement.dataset.postId;
  try {
    const response = await fetch(`/posts/${postId}/comments`);

    if (!response.ok) {
      commentErrorElement.textContent = 'Oops! Fetching comments failed!';
      commentErrorElement.style.display = 'block';
      return;
    }
    const responseData = await response.json();

    if (responseData && responseData.length > 0) {
      const commentsListElement = createCommentsList(responseData);
      commentsSectionElement.innerHTML = '';
      commentsSectionElement.appendChild(commentsListElement);
    } else {
      commentsSectionElement.firstElementChild.textContent = 'We could not find any comments. Maybe add one?';
    }
  } catch (error) {
    commentErrorElement.textContent = 'Oops! Getting comments failed!';
    commentErrorElement.style.display = 'block';
  }
}

async function saveComment(event) {
  event.preventDefault();
  const postId = commentsFormElement.dataset.postId;

  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;

  const comment = { title: enteredTitle, text: enteredText };

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      fetchCommentsForPost();
      commentTitleElement.value = '';
      commentTextElement.value = '';
    } else {
      commentErrorElement.textContent = 'Oops! Server Error - Could not send comment!';
      commentErrorElement.style.display = 'block';
    }
  } catch (error) {
    commentErrorElement.textContent = 'Oops! Connection Error - Please try again later!';
    commentErrorElement.style.display = 'block';
  }
}

async function showNumberOfComments() {
  const postId = loadCommentsBtnElement.dataset.postId;
  const response = await fetch(`/posts/${postId}/comments`);
  const responseData = await response.json();

  if (responseData && responseData.length > 0) {
    loadCommentsBtnElement.textContent = 'Load Comments (' + responseData.length + ')';
  } else {
    return;
  }
}

showNumberOfComments();
loadCommentsBtnElement.addEventListener('click', fetchCommentsForPost);
commentsFormElement.addEventListener('submit', saveComment);
