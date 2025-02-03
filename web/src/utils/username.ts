const username = async (token: string) => {
    const userResponse = await fetch('https://api.github.com/user', {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (!userResponse.ok) {
        console.log(token)
    }

    const userData = await userResponse.json();
    return userData.login;
}

export { username };
export default username;