"use client";

import React, { useState, useEffect } from "react";

function EventCard({ event, open, onClick }: { event: any, open: boolean, onClick: () => void }) {
  return (
    <div
      className="bg-stone-900 border border-stone-800 rounded shadow p-4 flex flex-col cursor-pointer hover:bg-stone-800 transition-colors"
      onClick={onClick}
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

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.zlcartcc.org/v1/events")
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-20 bg-neutral-950 min-h-screen py-8">
      <center><h1 className="text-3xl font-bold mb-4 text-white self-center">Events</h1></center>
      {loading && <p className="text-white">Loading...</p>}
      {!loading && events.length === 0 && <p className="text-white">No events found.</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event: any, idx: number) => (
          <EventCard
            key={event.id}
            event={event}
            open={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </main>
  );
};

export default EventsPage;