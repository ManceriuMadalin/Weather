let numOfClick = 0
let screenSize = window.innerWidth

window.onload = () => {
     const inputLocation = JSON.parse(localStorage.getItem('location'))

     if (inputLocation) {
          addData(inputLocation)
     } else {
          document.querySelector('.location').style.visibility = 'visible'
     }
}

document.addEventListener("keydown", (event) => {
     if ((event.which === 13) && (numOfClick === 0)) {
          const inputLocation = document.querySelector('#inputLocation').value;
          localStorage.setItem('location', JSON.stringify(inputLocation))
          addData(inputLocation)
     } else if ((event.which === 13) && (numOfClick > 0)) {
          numOfClick++
          const inputLocation = document.querySelector('#nextLocation').value;
          localStorage.setItem('location', JSON.stringify(inputLocation))
          addData(inputLocation)
     }
})

function styleContent() {
     if (screenSize > 767) {
          document.querySelector('#container').removeChild(document.querySelector('#container').children[0])
          document.querySelector('#location').style.visibility = 'visible'
          document.querySelector('#descriptions').style.visibility = 'visible'
          document.querySelector('#location').style.left = '35%'
          document.querySelector('#descriptions').style.left = '65%'
     } else {
          document.querySelector('#container').removeChild(document.querySelector('#container').children[0])
          document.querySelector('#location').style.visibility = 'visible'
          document.querySelector('#descriptions').style.visibility = 'visible'
          document.querySelector('#location').style.top = '30%'
          document.querySelector('#descriptions').style.top = '73.5%'
     }
}

function addRightContent(weatherData) {
     document.querySelector('#day').textContent = new Date(weatherData[0].day).toLocaleDateString('en-US', { weekday: 'long' })
     const d = new Date(weatherData[0].day);
     const day = d.getDate();
     const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
     const year = d.getFullYear();
     document.querySelector('#specificDate').textContent = day + month.charAt(0).toUpperCase() + month.slice(1) + year
     document.querySelector('#nameOfCity').textContent = weatherData[0].location.charAt(0).toUpperCase() + weatherData[0].location.slice(1)
     document.querySelector('#temp').textContent = weatherData[0].temperature.toFixed(1) + '°C'
     document.querySelector('#weatherDescription').textContent = weatherData[0].description.charAt(0).toUpperCase() + weatherData[0].description.slice(1)
}

function addLeftContent(weatherData) {
     let temps = document.querySelectorAll('.tempOfDay')
     let days = document.querySelectorAll('.dayOfWeek')

     for (let i = 0; i < temps.length; i++) {
          temps[i].textContent = weatherData[i].temperature.toFixed(1) + '°C'
     }

     for (let i = 0; i < days.length; i++) {
          days[i].textContent = new Date(weatherData[i].day).toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 3)
     }

     document.querySelector('#precipitation').textContent = weatherData[0].precipitation + 'mm'
     document.querySelector('#humidity').textContent = weatherData[0].humidity + '%'
     document.querySelector('#wind').textContent = (weatherData[0].wind * 3.6).toFixed(1) + 'km/h'
}

function addIcons(weatherData) {
     let j = 0;
     if (numOfClick >= 1) {
          let arr = document.querySelectorAll('i')
          for (let i = 1; i < arr.length; i++) {
               arr[i].innerHTML = ''
          }
     }
     for (let i = 1; i < 6; i++) {
          const img = document.createElement('img')
          img.src = 'http://openweathermap.org/img/wn/' + weatherData[j].iconW + '@2x.png'
          console.log(document.querySelectorAll('i')[i], weatherData[j].iconW)
          document.querySelectorAll('i')[i].appendChild(img)
          if (i > 1) {
               j++
               img.style.marginTop = '-10px'
               img.style.width = '50px'
               img.style.height = '50px'
          } else {
               img.style.width = '100px'
               img.style.height = '100px'
          }
     }
  }

function addData(location) {
     const apiKey = '547429bc04e48dc091c9a3b718888288';
     const weatherData = [];
     const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

     fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
               for (let i = 0; i < 4; i++) {
                    const weatherInfo = {
                         day: data.list[i * 8].dt_txt.slice(0, 10),
                         location: location,
                         temperature: data.list[i * 8].main.temp,
                         description: data.list[i * 8].weather[0].description,
                         precipitation: data.list[i * 8].rain ? data.list[i * 8].rain['1h'] || 0 : 0,
                         wind: data.list[i * 8].wind.speed,
                         humidity: data.list[i * 8].main.humidity,
                         iconW: data.list[0].weather[0].icon
                    };

                    weatherData.push(weatherInfo);
                    console.log(weatherData)
               }

               if (numOfClick === 0) { styleContent() }
               addLeftContent(weatherData)
               addRightContent(weatherData)
               addIcons(weatherData)
               numOfClick += 1
          })
          .catch(err => alert('The name of the city you entered does not exist.'));

     if (numOfClick === 0) {
          document.querySelector('#inputLocation').value = ''
     } else {
          document.querySelector('#nextLocation').value = ''
     }
}
