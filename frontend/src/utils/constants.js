const apiSettings = {
    url: "https://api.p1antain.students.nomoredomains.club",
    headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json',
    },
};

export { apiSettings };

//http://p1antain.students.nomoredomains.work
//api.p1antain.students.nomoredomains.club
