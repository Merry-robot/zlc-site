'use client';

import React, { useEffect, useState } from "react";

const CERT_ORDER = [
    { key: "zlc", label: "ZLC" },
    { key: "app_t2_s56", label: "S56" },
    { key: "lc_t2_slc", label: "SLC_TWR" },
    { key: "gc_t2_slc", label: "SLC_GND" }
];

const RosterPage = () => {
    const [roster, setRoster] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/roster")
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setRoster(Array.isArray(data) ? data : (data?.roster || []));
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load roster");
                setLoading(false);
            });
    }, []);

    function getControllerType(member: any) {
        return member.controller_type === "visitor" ? "Visitor" : "Home Controller";
    }

    const homeControllers = roster.filter((m) => getControllerType(m) === "Home Controller");
    const visitors = roster.filter((m) => getControllerType(m) === "Visitor");

    function renderMemberCard(member: any, idx: number) {
        return (
            <div
                key={member.id || idx}
                className="bg-stone-900 border border-stone-800 rounded shadow p-4 flex flex-col relative"
            >
                {/* OI badge in top right */}
                <div className="absolute top-2 right-2">
                    <span
                        className="bg-stone-800 text-stone-200 px-4 py-2 rounded text-lg font-extrabold shadow-lg"
                        style={{ fontSize: "1.5rem", minWidth: "3rem", textAlign: "center" }}
                    >
                        {member.operating_initials || "N/A"}
                    </span>
                </div>
                <h2 className="text-xl font-semibold mb-1 text-white flex items-center gap-2">
                    {member.first_name || "Unknown"} {member.last_name || ""}
                </h2>
                <div className="text-xs mb-2">
                    <span className={`px-2 py-1 rounded ${getControllerType(member) === "Visitor" ? "bg-blue-800 text-blue-200" : "bg-green-800 text-green-200"}`}>
                        {getControllerType(member)}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {CERT_ORDER.map(({ key, label }) => {
                        const cert = member.certifications?.[key];
                        return cert && cert.value !== "none" ? (
                            <span
                                key={key}
                                className="px-2 py-1 rounded text-xs font-semibold"
                                style={{ background: "#292524", color: "#fafaf9" }}
                            >
                                {cert.display_name || label}
                            </span>
                        ) : null;
                    })}
                </div>
                <div className="text-sm text-stone-400 mb-1">
                    <span className="font-semibold">Rating: </span>
                    {member.rating || "N/A"}
                </div>
            </div>
        );
    }

    return (
        <main className="p-20 bg-neutral-950 min-h-screen py-8">
            <center>
                <h1 className="text-3xl font-bold mb-4 text-white self-center">Roster</h1>
            </center>
            {loading && <p className="text-white">Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!loading && !error && roster.length === 0 && (
                <p className="text-white">No roster entries found.</p>
            )}

            {/* Home Controllers */}
            {homeControllers.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mb-4 mt-8 text-green-300">Home Controllers</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {homeControllers.map(renderMemberCard)}
                    </div>
                </>
            )}

            {/* Visitors */}
            {visitors.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mb-4 mt-16 text-blue-300">Visitors</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {visitors.map(renderMemberCard)}
                    </div>
                </>
            )}
        </main>
    );
};

export default RosterPage;