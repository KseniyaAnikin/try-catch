const form = document.getElementById('user-create-form');
const formError = document.getElementById('user-create-form-error');

async function createUser(data) {
  const errors = [];

  if(!data.email) 
    errors.push({
      name : 'email',
      message : 'Email обязательный для заполнения',
    });
  else if(!data.email.includes('@') || !data.email.includes('.'))
    errors.push({
      name : 'email',
      message : 'Email имеет неверный формат',
    });
  if(!data.name.trim()) 
    errors.push({
      name : 'name',
      message : 'Имя обязательно для заполнения',
    }); 
  if(!data.status) 
    errors.push({
      name : 'status',
      message : 'Статус обязателен для заполнения',
    });
    if(!data.gender) 
    errors.push({
      name : 'status',
      message : 'Пол обязателен для заполнения',
    }); 
    
  if(errors.length) {
    const err = new TypeError();
    err.errorsMessages = errors;
    throw err;
  }

  const response = await fetch('https://gorest.co.in/public-api/users' , {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Accept' : 'application/json',
      'Authorization' : 'Bearer 22aec7db8fb74eeaab0a6d50c348c318e2ad57f45b6d162de1b9229686b742f4'
    },
  }).then(res => res.json());

  if(response.code === 200 || response.code === 201) {
    return response.data;
  }

  if(response.data) {
    const err = new TypeError();
    err.errorsMessages = response.data.map(err => ({
      name : err.field,
      message : err.message,
    }));
    throw err;
  }

  throw new Error('Не удалось создать нового пользователя');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {};
  const inputs = {};
  const spinner = form.querySelector('button .spinner-border');

  for( let i = 0 ; i < form.elements.length; ++i){
    const input = form.elements[i];
    if(!input.name) continue;
    data[input.name] = input.value;
    inputs[input.name] = input;
    input.classList.remove('is-invalid');
    formError.textContent = '';
  }
  try {
    spinner.style.display ='';
    await createUser(data);
  } catch(err) {
    if (err.name !== 'TypeError') throw err;
    if(err.errorsMessages) {
      for (const errorMessage of err.errorsMessages) {
        inputs[errorMessage.name].classList.add('is-invalid');
      }
      formError.textContent = err.errorsMessages.map(errorMessage => errorMessage.message)
      .join('. ')
    }
  } finally {
      spinner.style.display = 'none';
  }
});