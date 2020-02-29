const fastify = require('fastify')();
const puppeteer = require('puppeteer');
const axios = require('axios').default;
let browser
puppeteer.launch().then(result => browser = result)

const blockedResourceTypes = [
    'image',
    'media',
    'font',
    'texttrack',
    'gif',
    'png',
    'jpeg',
    'jpg',
    'object',
    'css',
    'stylesheet',
    'beacon',
    'csp_report',
    'imageset',
];

const skippedResources = [
    'quantserve',
    'adzerk',
    'doubleclick',
    'adition',
    'exelator',
    'sharethrough',
    'cdn.api.twitter',
    'google-analytics',
    'googletagmanager',
    'google',
    'fontawesome',
    'facebook',
    'analytics',
    'optimizely',
    'clicktale',
    'mixpanel',
    'zedo',
    'clicksor',
    'tiqcdn',
];


const getGismeteo = async function (city, date) {

    const gismeteo = await browser.newPage()

    await gismeteo.setRequestInterception(true);

    gismeteo.on('request', request => {
        const requestUrl = request._url.split('?')[0].split('#')[0];
        if (
            blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
            skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
        ) {
            request.abort();
        } else {
            request.continue();
        }
    });

    const forecast = {
        name: 'gismeteo.ua'
    },

        userDate = {
            year: date.slice(0, 4),
            month: +(date.slice(5, 7)) - 1,
            day: date.slice(8, 10)
        },

        now = new Date(),

        currentDate = new Date(userDate.year, userDate.month, userDate.day, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()),

        daysAmount = (currentDate - now) / 86400000

    const url = (await axios.get(`http://localhost:8080/urls?name=${city}`)).data[0].GismeteoURL

    await gismeteo.goto(`https://www.gismeteo.ua/${url}`, { timeout: 0 })

    const temperatures = (await gismeteo.$$('.chart__temperature > .values > .value'))[daysAmount]
    const maxTempNode = await temperatures.$('.maxt > .unit_temperature_c')

    const maxTemp = await maxTempNode.evaluate(node => node.innerText)
    const minTempNode = await temperatures.$('.mint > .unit_temperature_c')
    const minTemp = await minTempNode.evaluate(node => node.innerText)

    forecast.maxTemperature = maxTemp + '°'
    forecast.minTemperature = minTemp + '°'


    const windNode = (await gismeteo.$$('.w_wind .unit_wind_m_s'))[daysAmount]
    const maxWindSpeed = await windNode.evaluate(node => node.innerText)


    forecast.wind = maxWindSpeed + ' m/s (max)'

    const precsNode = (await gismeteo.$$('.widget__row_precipitation .w_prec__value'))[daysAmount]
    const precipitations = await precsNode.evaluate(node => node.innerText)

    forecast.precips = precipitations + ' mm'

    const overcastElems = (await gismeteo.$$('.widget__row_icon .widget__item'))[daysAmount]
    const overcastNode = await overcastElems.$('.tooltip')
    const overcast = await overcastNode.evaluate(node => node.getAttribute('data-text'))

    forecast.overcast = overcast

    gismeteo.close()

    return forecast

}
const getWeather = async function (city, date) {

    const weather = await browser.newPage()
    await weather.setRequestInterception(true);

    weather.on('request', request => {
        const requestUrl = request._url.split('?')[0].split('#')[0];
        if (
            blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
            skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
        ) {
            request.abort();
        } else {
            request.continue();
        }
    });
    
    const forecast = {
        name: 'weather.com'
    },

        userDate = {
            year: date.slice(0, 4),
            month: +(date.slice(5, 7)) - 1,
            day: date.slice(8, 10)
        },

        now = new Date(),

        currentDate = new Date(userDate.year, userDate.month, userDate.day, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()),

        daysAmount = (currentDate - now) / 86400000

    const url = (await axios.get(`http://localhost:8080/urls?name=${city}`)).data[0].WeatherURL
    await weather.goto(`https://weather.com/${url}`, { timeout: 0 })

    const temperaturesList = (await weather.$$('td.temp'))[daysAmount]
    const temperatures = await temperaturesList.$$('span')
    const maxTemp = await temperatures[0].evaluate(node => node.innerText),
        minTemp = await temperatures[2].evaluate(node => node.innerText)

    maxTemperatureStr = (Math.round((parseInt(maxTemp) - 32) * (5/9))) + '°'
    minTemperatureStr = (Math.round((parseInt(minTemp) - 32) * (5/9))) + '°'

    if (parseInt(maxTemperatureStr) > 0) {
        forecast.maxTemperature = `+${maxTemperatureStr}`
    }
    else {
        forecast.maxTemperature = maxTemperatureStr
    }
    
    if (parseInt(minTemperatureStr) > 0) {
        forecast.minTemperature = `+${minTemperatureStr}`
    }
    else {
        forecast.minTemperature = minTemperatureStr
    }

    
    const windList = (await weather.$$('td.wind'))[daysAmount]
    const windSpan = await windList.$('span')
    const wind = await windSpan.evaluate(node => node.innerText)
    const windStr = wind.split(' ')[1]

    forecast.wind = Math.round(windStr / 2.237) + ' m/s (mean)'

    const precipList = (await weather.$$('td.precip'))[daysAmount]
    const precipSpan = await precipList.$('span>span')
    const precips = await precipSpan.evaluate(node => node.innerText)

    forecast.precips = precips

    const overcastList = (await weather.$$('td.description'))[daysAmount]
    const overcastSpan = await overcastList.$('span')
    const overcast = await overcastSpan.evaluate(node => node.innerText)

    forecast.overcast = overcast

    weather.close()


    return forecast
}
const getSinoptik = async function (city, date) {

    const sinoptik = await browser.newPage(),
        forecast = {
            name: 'sinoptik.ua'
        }

    await sinoptik.setRequestInterception(true);

    sinoptik.on('request', request => {
        const requestUrl = request._url.split('?')[0].split('#')[0];
        if (
            blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
            skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
        ) {
            request.abort();
        } else {
            request.continue();
        }
    });

    const url = (await axios.get(`http://localhost:8080/urls?name=${city}`, { timeout: 0 })).data[0].SinoptikURL
    await sinoptik.goto(`https://sinoptik.ua/${url}/${date}`)
    sinoptik.screenshot({ path: 'relative', type: 'jpeg' })

    const minTempNode = await sinoptik.$('.loaded .min span')
    const minTemp = await minTempNode.evaluate(node => node.innerText)
    const maxTempNode = await sinoptik.$('.loaded .max span')
    const maxTemp = await maxTempNode.evaluate(node => node.innerText)

    forecast.maxTemperature = maxTemp
    forecast.minTemperature = minTemp

    const winds = await sinoptik.$$('tr>td>.wind'),
        windsArray = []
    for (let i = 0; i < winds.length; i++) {
        let el = await winds[i].evaluate(node => node.innerHTML)
        windsArray.push(el)
    }

    forecast.wind = (Math.max.apply(null, windsArray)) + ' m/s (max)'

    const precipsTr = await sinoptik.$$('.weatherDetails>tbody>tr')
    const precips = await precipsTr[7].$$('td'),
        precipsArray = []

    for (let i = 0; i < precips.length; i++) {
        let el = await precips[i].evaluate(node => node.innerHTML)
        if (el === '-') {
            precipsArray.push(0)
        } else {
            precipsArray.push(+el)
        }
    }

    forecast.precips = (Math.max.apply(null, precipsArray)) + '%'

    const overcastDiv = await sinoptik.$('.main.loaded>.weatherIco')
    const overcast = await overcastDiv.evaluate(node => node.getAttribute('title'))

    forecast.overcast = overcast

    sinoptik.close()

    return forecast

}

const options = {
    city: '',
    date: ''
}

const methods = {
    'gismeteo.ua': getGismeteo,
    'sinoptik.ua': getSinoptik,
    'weather.com': getWeather
}

fastify.register(require('fastify-cors'));

fastify.get('/', async (request, reply) => {
    const resource = Object.keys(request.query)[0]
    if (!methods[resource]) {
        reply.callNotFound()
    }

    const forecast = methods[resource](options.city, options.date)
    return forecast
})



fastify.get('/cities', async (request, reply) => {
    let arr = await axios.get('http://localhost:8080/urls')
    let cities = arr.data.map(el => el.name)
    return cities
})

fastify.get('/resourses', async (request, reply) => {
    const resourses = Object.keys(methods)
    return resourses
})

fastify.post('/', async (request, reply) => {
    const body = request.body

    options.city = body.city
    options.date = body.date

    return options
})



fastify.listen(5000)



