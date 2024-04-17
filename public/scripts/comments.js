const loadCommentsBtnElement = document.getElementById('load-comments-btn');

async function fetchCommentsForPost(event) {
  const postId = loadCommentsBtnElement.dataset.postId;
  const response = await fetch(`/posts/${postId}/comments`);
  const responseData = await response.json();
  console.log(responseData);
}

loadCommentsBtnElement.addEventListener('click', fetchCommentsForPost);
