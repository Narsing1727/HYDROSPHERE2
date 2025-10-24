// components/DatasetAvailability.jsx
import React, { useMemo } from "react";

/**
 * DatasetAvailability
 * Props:
 *  - startDate (string, YYYY-MM-DD)
 *  - endDate   (string, YYYY-MM-DD)
 *
 * Usage:
 *  <DatasetAvailability startDate={startDate} endDate={endDate} />
 *
 * The component shows dataset, description, available years, and a status badge.
 */

const DATASETS = [
  {
    id: "chirps",
    name: "UCSB-CHG/CHIRPS/DAILY",
    description: "Daily rainfall (5 km)",
    availableFrom: "1981-01-01",
    availableTo: "present",
    note: "Works for historic years (1981–present).",
  },
  {
    id: "smap",
    name: "NASA/SMAP/SPL4SMGP/007",
    description: "Soil moisture (surface)",
    availableFrom: "2015-01-01",
    availableTo: "present",
    note: "Not available before 2015 (use fallback).",
  },
  {
    id: "sentinel1",
    name: "COPERNICUS/S1_GRD",
    description: "Sentinel-1 SAR (VV) — radar backscatter",
    availableFrom: "2014-10-01",
    availableTo: "present",
    note: "Radar-based flood detection available from 2014 onward.",
  },
  {
    id: "srtm",
    name: "USGS/SRTMGL1_003",
    description: "SRTM elevation (static)",
    availableFrom: "2000-01-01",
    availableTo: "present",
    note: "Static elevation — always available.",
  },
  {
    id: "modis",
    name: "MODIS/061/MCD12Q1",
    description: "MODIS Land Cover (yearly)",
    availableFrom: "2001-01-01",
    availableTo: "2023-12-31",
    note: "Annual landcover products; 2001–2023.",
  },
];

function parseDateSafe(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function formatRange(from, to) {
  if (to === "present") return `${from.slice(0, 4)} — present`;
  return `${from.slice(0, 4)} — ${to.slice(0, 4)}`;
}

export default function Data({ startDate, endDate }) {
  const start = useMemo(() => parseDateSafe(startDate), [startDate]);
  const end = useMemo(() => parseDateSafe(endDate), [endDate]);

  const rows = useMemo(() => {
    return DATASETS.map((ds) => {
      const dsFrom = parseDateSafe(ds.availableFrom);
      const dsTo = ds.availableTo === "present" ? new Date() : parseDateSafe(ds.availableTo);

      // status:
      // - "available": entire user range inside dataset range
      // - "partial": partially overlaps
      // - "unavailable": no overlap
      let status = "available";
      if (!start || !end) {
        // if user didn't provide range, consider dataset available (informational)
        status = "available";
      } else {
        if (end < dsFrom || start > dsTo) {
          status = "unavailable";
        } else if (start >= dsFrom && end <= dsTo) {
          status = "available";
        } else {
          status = "partial";
        }
      }

      return {
        ...ds,
        status,
        dsRange: formatRange(ds.availableFrom, ds.availableTo),
      };
    });
  }, [start, end]);

  return (
    <div className="mt-6 bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Dataset availability</h3>
      <p className="text-sm text-gray-600 mb-4">
        Selected date range:{" "}
        <strong className="text-gray-800">
          {startDate || "—"} → {endDate || "—"}
        </strong>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-600 border-b">
              <th className="py-2 px-3">Dataset</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3">Available</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="text-sm text-gray-700 border-b last:border-b-0">
                <td className="py-3 px-3 font-medium">{r.name}</td>
                <td className="py-3 px-3">{r.description}</td>
                <td className="py-3 px-3">{r.dsRange}</td>
                <td className="py-3 px-3">
                  {r.status === "available" ? (
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      <svg className="w-3 h-3" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 4l1 1 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Available
                    </span>
                  ) : r.status === "partial" ? (
                    <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                      <svg className="w-3 h-3" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="4" cy="6" r="0.5" fill="currentColor"/></svg>
                      Partial
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                      <svg className="w-3 h-3" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      Unavailable
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-gray-600">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Tip: <strong>CHIRPS</strong> (rain) is the most useful for older dates (e.g. 2011). Radar (Sentinel-1) and SMAP soil moisture started later — UI will use fallback values when a dataset is missing.
      </div>
    </div>
  );
}
