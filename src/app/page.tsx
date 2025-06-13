"use client";

import React, { useState, useEffect, useRef } from "react";

function EventCard({ event }: { event: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-stone-900 border border-stone-800 rounded shadow p-4 flex flex-col cursor-pointer hover:bg-stone-800 transition-colors mt-8 w-[420px] min-h-[320px] max-w-[420px]"
      onClick={() => setOpen((v) => !v)}
    >
      <img
        src={event.banner}
        alt={event.title}
        className="rounded mb-2 max-h-40 w-auto self-center"
        style={{ objectFit: "contain" }}
      />
      <h2 className="text-xl font-semibold mb-1 text-white">{event.title}</h2>
      <div className="text-sm text-stone-400 mb-2">
        <span>Start: {new Date(event.start_date).toLocaleString()}</span>
      </div>
      {open && (
        <>
          <p className="text-stone-200 mb-2 whitespace-pre-line">{event.description}</p>
          <div className="text-sm text-stone-400 mb-1">
            <span>End: {new Date(event.end_date).toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const weatherAirports = ["KBIL", "KBOI", "KBZN", "KJAC", "KSLC"];

  const leftColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://api.zlcartcc.org/v1/events")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        const now = new Date();
        const nextEvent = data
          .filter((e: any) => new Date(e.start_date) > now)
          .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0] || null;
        setEvent(nextEvent);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const results = await Promise.all(
          weatherAirports.map(async (id) => {
            const res = await fetch(`https://api.zlcartcc.org/v1/weather/ZLC/${id}`);
            if (!res.ok) return { id, flight_category: "-", updated: null };
            const data = await res.json();
            return { id, flight_category: data.flight_category || data.FlightCategory || "-", updated: data.observation_time || data.ObservationTime || null };
          })
        );
        setWeather(results);
      } finally {
        setWeatherLoading(false);
      }
    }
    fetchWeather();
  }, []);

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col items-center pt-[72px]">
      <div className="flex flex-col lg:flex-row max-w-7xl w-full mx-auto items-stretch justify-center min-h-screen">
        <div
          className="flex flex-col items-center w-full lg:w-[440px] flex-shrink-0"
          ref={leftColRef}
        >
          {loading && <p className="text-white text-center">Loading next event...</p>}
          {!loading && event && (
            <EventCard event={event} />
          )}
          {!loading && !event && <p className="text-white text-center mt-8">No upcoming events found.</p>}
          <div className="mt-8 w-full flex justify-center">
            <div className="bg-stone-900 border border-stone-800 rounded-lg shadow-lg p-6 w-[420px] max-w-[420px] mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Weather</h2>
              {weatherLoading ? (
                <div className="text-stone-400 text-center">Loading weather...</div>
              ) : (
                <table className="min-w-full text-stone-200 text-center">
                  <thead>
                    <tr className="border-b border-stone-800">
                      <th className="py-2 px-4 font-semibold">Airport</th>
                      <th className="py-2 px-4 font-semibold">Flight Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weather.map((wx) => (
                      <tr key={wx.id} className="border-b border-stone-800">
                        <td className="py-2 px-4 font-mono text-center">{wx.id}</td>
                        <td className="py-2 px-4 lowercase text-center">
                          <span className={`uppercase font-bold ${["vfr", "VFR"].includes(wx.flight_category) ? "text-green-400" : ["mvfr", "MVFR"].includes(wx.flight_category) ? "text-blue-400" : ["ifr", "IFR"].includes(wx.flight_category) ? "text-red-400" : ["lifr", "LIFR"].includes(wx.flight_category) ? "text-pink-400" : "text-stone-200"}`}>{wx.flight_category || "-"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="text-stone-400 text-xs mt-4 text-right">
                Updated: {weather.find(w => w.updated)?.updated ? new Date(weather.find(w => w.updated).updated).toLocaleTimeString() : new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}