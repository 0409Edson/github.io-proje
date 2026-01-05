document.addEventListener('DOMContentLoaded', async () => {
    const avatar = document.querySelector('#avatar');
    const name = document.querySelector('#name');
    const username = document.querySelector('#username');
    const repos = document.querySelector('#repos');
    const followers = document.querySelector('#followers');
    const following = document.querySelector('#following');
    const link = document.querySelector('#link');

    try {
        const response = await fetch('https://api.github.com/users/ogiansouza');
        
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados do GitHub');
        }

        const data = await response.json();

        avatar.src = data.avatar_url;
        name.innerText = data.name;
        username.innerText = `@${data.login}`;
        repos.innerText = data.public_repos;
        followers.innerText = data.followers;
        following.innerText = data.following;
        link.href = data.html_url;

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao carregar dados do perfil. Por favor, tente novamente mais tarde.');
    }
});
