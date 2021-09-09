function update(){
    var data = JSON.stringify({
        email: "eonnguyen@gmail.com",
        phone: "0973544454",
        password: "123456",
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("PUT", "http://localhost:3001/api/v1/private/account/6123c4c56700992f06988832");
    xhr.setRequestHeader(
        "authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJVS0Jhc2UgQWNjb3VudCIsInN1YiI6IjYxMjNjNGM1NjcwMDk5MmYwNjk4ODgzMkBVU0VSX0lEIiwiaWF0IjoxNjI5NzM0NTQwLjMzMywiZXhwIjoxNjMyMzI2NTQwLjMzMywiYXVkIjoiVUtCYXNlIFNxdWFyZSBTeXN0ZW0iLCJzY29wZSI6W119.Ke6Up5Fa-FhcaoP1qms8GYWmdQPtTUGLj2GUZFuo-1Q"
    );
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);

}