"use client";

import React, { useState, useEffect } from "react";

function StaffCard({ staff, open, onClick }: { staff: any, open: boolean, onClick: () => void }) {
  return (
    <div
      className="bg-stone-900 border border-stone-800 rounded-lg shadow-lg p-6 flex flex-col items-center cursor-pointer hover:bg-stone-800 transition-colors text-center min-h-[300px] max-w-xs mx-auto w-full h-full"
      onClick={onClick}
      style={{ minHeight: 300, maxWidth: 320, width: '100%' }}
    >
      <div className="w-20 h-20 rounded-full bg-stone-700 flex items-center justify-center text-3xl font-bold text-white mb-3">
        {(
          staff.operating_initials
            ? staff.operating_initials.slice(0, 2)
            : ((staff.first_name?.[0] || '') + (staff.last_name?.[0] || '')).slice(0, 2)
        )}
      </div>
      <h2 className="text-lg font-semibold text-white mb-1">{staff.first_name} {staff.last_name}</h2>
      <div className="flex-grow" />
      <div className="text-stone-400 text-sm mb-2 font-mono text-left w-full flex items-end">
        <ul className="list-disc list-inside w-full">
          {Array.isArray(staff.roles)
            ? staff.roles
                .filter((role: string, _idx: number, arr: string[]) => {
                  if (["events_team", "facilities_team", "events", "facilities"].includes(role)) return false;
                  if (arr.includes("ta")) return role !== "instructor";
                  return true;
                })
                .map((role: string) => {
                  const roleMap: Record<string, string> = {
                    atm: "ATM",
                    datm: "DATM",
                    ta: "Training Administrator",
                    fe: "Facility Engineer",
                    wm: "Webmaster",
                    ec: "Events Coordinator",
                    instructor: "Instructor",
                    mentor: "Mentor",
                  };
                  return <li key={role}>{roleMap[role] || role}</li>;
                })
            : <li>{staff.role || 'N/A'}</li>}
        </ul>
      </div>
    </div>
  );
}

const StaffPage = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.zlcartcc.org/v1/user/staff")
      .then((res) => res.ok ? res.json() : {})
      .then((data) => {
        const staffByCid: Record<string, any> = {};
        Object.entries(data).forEach(([role, arr]) => {
          if (Array.isArray(arr)) {
            arr.forEach((staff) => {
              if (staffByCid[staff.cid]) {
                if (!staffByCid[staff.cid].roles.includes(role)) {
                  staffByCid[staff.cid].roles.push(role);
                }
              } else {
                staffByCid[staff.cid] = { ...staff, roles: [role] };
              }
            });
          }
        });
        setStaffList(Object.values(staffByCid));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-neutral-950 min-h-screen py-8 overflow-hidden">
      <center><h1 className="text-3xl font-bold mb-8 text-white self-center">Facility Staff</h1></center>
      {loading && <p className="text-white">Loading...</p>}
      {!loading && staffList.length === 0 && <p className="text-white">No staff found.</p>}
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 w-full max-w-7xl mx-auto">
          {['atm', 'datm', 'ta', 'fe', 'wm', 'ec'].map((roleKey) => {
            const staff = staffList.find((s: any) => s.roles.includes(roleKey));
            if (!staff) return null;
            return (
              <StaffCard
                key={staff.cid || staff.first_name+staff.last_name}
                staff={staff}
                open={openIndex === roleKey}
                onClick={() => setOpenIndex(openIndex === roleKey ? null : roleKey)}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto mt-8">
          <div className="bg-stone-900 border border-stone-800 rounded-lg shadow-lg p-6 text-center overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-2">Facilities Team</h2>
            <p className="text-stone-300 mb-4">Assists the Facility Engineer.</p>
            <ul className="text-stone-200 space-y-1">
              <li>Andres Honegger</li>
              <li>Raaj Patel</li>
              <li>Jonah Lefkoff</li>
              <li>Adam Earl</li>
              <li>Elijah Jubrey</li>
            </ul>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-lg shadow-lg p-6 text-center overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-2">Events Team</h2>
            <p className="text-stone-300 mb-4">Assists the Events Coordinator.</p>
            <ul className="text-stone-200 space-y-1">
              <li>Cameron Negrete</li>
              <li>Evan McSweeny</li>
              <li>Adam Earl</li>
              <li>Elijah Jubrey</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StaffPage;