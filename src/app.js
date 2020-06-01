import { http } from './http';
import { ui } from './ui';

// Display on load
document.addEventListener('DOMContentLoaded', getPosts);
// Add post
document.querySelector('.post-submit').addEventListener('click', submitPost);
// Delete post
document.querySelector('#posts').addEventListener('click', deletePost);
// Edit post
document.querySelector('#posts').addEventListener('click', enableEdit);
// Cancel post
document.querySelector('.card-form').addEventListener('click', cancelEdit);

function getPosts() {
  http.get('http://localhost:3000/posts')
  .then(data => ui.showPosts(data))
  .catch(err => console.log(err))
};

function submitPost(){
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;

  const data = {
    title,
    body
  } 
  // Input validate
  if(title === '' || body === ''){
    ui.showAlert('Please complete fields','alert alert-danger');
  } else {
    if(id === ''){
      http.post('http://localhost:3000/posts', data)
      .then(data => {
        ui.showAlert('Post added!', 'alert alert-danger');
        ui.clearFields();
        getPosts();
      })
      .catch(err => console.log(err))
    } else {
      http.put(`http://localhost:3000/posts/${id}`, data)
      .then(data => {
        ui.showAlert('Post updated!', 'alert alert-danger');
        ui.changeFormState('add');
        getPosts();
      })
      .catch(err => console.log(err))
    }
  }
};

function deletePost(event){
  if(event.target.parentElement.classList.contains('delete')){
    const id = event.target.parentElement.dataset.id;
    if(confirm('Are you sure?')){
      http.delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert('Post removed!', 'alert alert-danger');
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
  event.preventDefault();
};

function enableEdit(event){
  if(event.target.parentElement.classList.contains('edit')){
    const id = event.target.parentElement.dataset.id;
    const title = event.target.parentElement.previousElementSibling.previousElementSibling.textContent;
    const body = event.target.parentElement.previousElementSibling.textContent;
    const data = {
      id,
      title,
      body
    }
    ui.fillForm(data);
  }
  event.preventDefault();
}

function cancelEdit(event){
  if(event.target.classList.contains('post-cancel')){
    ui.changeFormState('add');
  }

  event.preventDefault();
}


