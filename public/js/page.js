const form = document.querySelector('form')
const search = document.querySelector('#url')
const mssg1 = document.querySelector('#mssg1')
const mssg1 = document.querySelector('#mssg1')
const mssg2 = document.querySelector('#mssg2')



document.addEventListener('submit' , (e) => {
    e.preventDefault()
    
    if(mssg1)
    mssg1.textContent = 'invalid credentials'

    if(mssg2)
    mssg2.textContent = 'success'
})

