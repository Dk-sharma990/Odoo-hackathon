// FRONTEND LOGIN + SIGNUP FOR GITHUB PAGES

try {

    // SIGNUP
    if (authMode === 'signup') {

        const userData = {
            id: Date.now(),
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem(
            'traveloopUser',
            JSON.stringify(userData)
        );

        currentUser = userData;

        alert('Signup Successful');

        navigateTo('dashboard');
    }

    // LOGIN
    else {

        const savedUser = JSON.parse(
            localStorage.getItem('traveloopUser')
        );

        if (
            savedUser &&
            savedUser.email === email &&
            savedUser.password === password
        ) {

            currentUser = savedUser;

            alert('Login Successful');

            navigateTo('dashboard');

        } else {

            alert('Invalid Email or Password');

        }
    }

} catch (err) {

    console.error(err);

    alert('Login Failed');

}
