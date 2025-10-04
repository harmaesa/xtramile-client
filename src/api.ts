import axios from 'axios'

let listeners: ((loading: boolean) => void)[] = []
export const onLoading = (fn: (loading: boolean) => void) => {
  listeners.push(fn); return () => { listeners = listeners.filter(f => f !== fn) }
}

const setLoading = (v: boolean) => listeners.forEach(l => l(v))
const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'
export const api = axios.create({ baseURL: apiBaseUrl })

api.interceptors.request.use(cfg => { setLoading(true); return cfg })
api.interceptors.response.use(
  res => { setLoading(false); return res },
  err => { setLoading(false); return Promise.reject(err) }
)

export type Country = { code: string, name: string }
export type City = { name: string, countryCode: string }
export type Weather = {
  city: string, country: string, utcTime: string,
  windSpeed: number, windDirection: number, visibility: number, sky: string,
  temperatureF: number, temperatureC: number, dewPoint: number, humidity: number, pressure: number
}

export const fetchCountries = async () => (await api.get<Country[]>('countries')).data
export const fetchCities = async (code: string) => (await api.get<City[]>(`countries/${code}/cities`)).data
export const fetchWeather = async (city: string) => (await api.get<Weather>(`weather/${encodeURIComponent(city)}`)).data