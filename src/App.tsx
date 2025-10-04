import { useEffect, useMemo, useState } from 'react'
import { City, Country, Weather, fetchCities, fetchCountries, fetchWeather, onLoading } from './api'

export default function App() {
  const [countries, setCountries] = useState<Country[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [wx, setWx] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const off = onLoading(setLoading)
    fetchCountries().then(setCountries).catch(() => setError('Failed to load countries'))
    return () => off()
  }, [])

  useEffect(() => {
    setWx(null); setCity(''); setError('')
    if (!country) return
    fetchCities(country).then(setCities).catch(() => setError('Failed to load cities'))
  }, [country])

  const submit = async () => {
    setError(''); setWx(null)
    try { setWx(await fetchWeather(city)) } catch { setError('Weather not found') }
  }

  const canSubmit = useMemo(() => !!city, [city])

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-900 text-neutral-100">
      <div className="w-[92vw] max-w-[520px] rounded-2xl bg-neutral-800/80 p-6 shadow-2xl backdrop-blur">
        <h1 className="text-xl font-semibold mb-3">Weather</h1>

        <label className="block text-sm text-neutral-400 mt-2 mb-1">Country</label>
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100"
        >
          <option value="">Select a country</option>
          {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>

        <label className="block text-sm text-neutral-400 mt-3 mb-1">City</label>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          disabled={!country}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100 disabled:opacity-50"
        >
          <option value="">{country ? 'Select a city' : 'Select a country first'}</option>
          {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>

        <button
          onClick={submit}
          disabled={!canSubmit}
          className="mt-4 w-full rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          Get Weather
        </button>

        {!!error && <div className="mt-2 text-sm text-red-400">{error}</div>}

        {wx && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Location</b>
              {wx.city}, {wx.country}
            </div>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Time (UTC)</b>
              {new Date(wx.utcTime).toUTCString()}
            </div>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Wind</b>
              {wx.windSpeed} m/s @ {wx.windDirection}°
            </div>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Visibility</b>
              {wx.visibility} m
            </div>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Sky</b>
              {wx.sky}
            </div>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Temp</b>
              {wx.temperatureC} °C ({wx.temperatureF} °F)
            </div>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Dew Point</b>
              {wx.dewPoint}
            </div>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Humidity</b>
              {wx.humidity}%
            </div>
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm col-span-2">
              <b className="block text-blue-300 text-xs mb-1 font-semibold">Pressure</b>
              {wx.pressure} hPa
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
            <div className="size-9 animate-spin rounded-full border-2 border-blue-500 border-r-transparent" />
          </div>
        )}
      </div>
    </div>
  )
}