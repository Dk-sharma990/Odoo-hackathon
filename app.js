const endpoint = authMode === 'signup' ? `${API_URL}/signup` : `${API_URL}/login`;
const body = authMode === 'signup' ? { name, email, password } : { email, password };

try {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
        currentUser = data;
        navigateTo('dashboard');
    } else {
        alert(data.error);
    }
} catch (err) {
    console.error(err);
    alert("Failed to connect to server");
}
