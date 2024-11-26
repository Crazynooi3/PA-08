
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
console.log(capitals);

// -----------------------------------------------
const inputElm = document.getElementById('search')
const suggestionsList = document.getElementById('suggestionsList');
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
console.log(inputElm);






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