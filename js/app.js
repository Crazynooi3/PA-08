
async function fetchCountries() {
    try {    
        const response = await fetch('https://restcountries.com/v3.1/all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    
    const data = await response.json();
    return data;
    } catch (error) {
        console.error('we have an error:', error)
    }
}


async function fetchWeather(lon , lat) {
    try {    
        const response = await fetch(`https://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`)
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('we have an error:', error)
    }
}


let customData = []
let capitals =[]
async function dataProgress() {
    const data = await fetchCountries();
    data.forEach((country) => {
        let dic = {'name':'', 'capital':'', 'lat':0 ,'len':0}

        dic.name = country.name.common;
        dic.capital = country.capital ? country.capital[0] : 'N/A'
        dic.lat = country.latlng ? country.latlng[0] : 0
        dic.len = country.latlng ? country.latlng[1] : 0

        customData.push(dic)
        capitals.push(`${country.name.common}, ${country.capital ? country.capital[0] : 'N/A'}`)
    })
}
dataProgress()
// console.log(customData);
// console.log(capitals);

// -----------------------------------------------
const inputElm = document.getElementById('search')
const suggestionsList = document.getElementById('suggestionsList');
const W_rightElmn = document.querySelector('.Wrapper_right')
const locationElem = document.querySelector('.location')
const timeElem = document.querySelector('time')

inputElm.addEventListener('input', function () {
    const value = inputElm.value.toLowerCase()
    suggestionsList.innerHTML = ''
    if (value) {
        const filteredSuggestions = capitals.filter(item => item.toLowerCase().includes(value))
        filteredSuggestions.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item
            li.style.cursor = 'pointer';
            li.classList.add('sug_li') 
            li.addEventListener('click', function(){
                inputElm.value = item
                suggestionsList.style.display = 'none'
            })
            suggestionsList.appendChild(li)
        })
        suggestionsList.style.display = filteredSuggestions.length ? 'block' : 'none';
    }else {
        suggestionsList.style.display = 'none';
    }
    
})

function getLonLet(event) {
    let lat = 0;
    let lon = 0;
    if (event.key === 'Enter') {
        const userSearch = inputElm.value.split(',')[0].trim();
        const result = customData.filter(item => 
            item.name.includes(userSearch) || item.capital.includes(userSearch))
        
        lat = result[0].lat
        lon = result[0].len

    return [lon,lat]
}};
function formatDate(dateString) {
    // تاریخ از فرمت YYYYMMDD به یک تاریخ قابل استفاده تبدیل شود
    const year = parseInt(dateString.substring(0, 4)); // سال را استخراج کنیم
    const month = parseInt(dateString.substring(4, 6)) - 1; // ماه (منهای ۱ چون ماه‌ها در Date از 0 شروع می‌شوند)
    const day = parseInt(dateString.substring(6, 8)); // روز

    // ساخت یک شیء تاریخ
    const date = new Date(year, month, day);

    // گرفتن روز هفته و فرمت کردن تاریخ
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}
inputElm.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        const [lon, lat] = getLonLet(event);
        const data = await fetchWeather(lon, lat);
                
        if (data && data.dataseries) {
            const wrapper = document.querySelectorAll('.Weather_detail')
                wrapper.forEach(elem => elem.remove())
            data.dataseries.forEach((weatherData) => {
                // فرض می‌کنیم که weatherData شامل دما، وضعیت هوا و سرعت باد است
                const weatherHTML = `
                    <div class="Weather_detail">
                        <span>${formatDate(weatherData.date.toString())}</span>
                        <div class="row">
                            <span>Temp max</span>
                            <div class="row_temp">
                                <span>${weatherData.temp2m.max}°</span>
                                <span><img src="./icons/Vector (3).png" alt=""></span>
                            </div>
                        </div>
                        <div class="row">
                            <span>Temp min</span>
                            <div class="row_temp">
                                <span>${weatherData.temp2m.min}°</span>
                                <span><img src="./icons/Vector (4).png" alt=""></span>
                            </div>
                        </div>
                        <div class="row">
                            <span>weather</span>
                            <div class="row_temp">
                                <span>${weatherData.weather}</span>
                                <span><img src="./icons/Cloudy.png" width="22px" alt=""></span>
                            </div>
                        </div>
                        <div class="row">
                            <span>wind</span>
                            <div class="row_temp">
                                <span>${weatherData.wind10m_max} m/s</span>
                                <span><img src="./icons/outline.png" width="22px" alt=""></span>
                            </div>
                        </div>
                    </div>
                `;
                locationElem.innerHTML = inputElm.value.split(',')[1].trim();
                // timeElem.innerHTML = formatDate(data.dataseries[0].date.toString());
                W_rightElmn.insertAdjacentHTML('beforeend', weatherHTML);
            });
        } else {
            console.error('Failed to retrieve weather data.');
        }
    }
});


// ------------------------------------------------------







// const finalList = []
// async function creatDic() {
//     const countries = await fetchCountries();
//     console.log(countries);
//     let dic = {
//         'common' : '',
//         'capital': '',
//         'latlng': []
//     }
// }

// creatDic()