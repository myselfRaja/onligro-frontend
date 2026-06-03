"use client";

import { useState } from "react";
import { ChevronDown, Check, User, Sparkles } from "lucide-react";

export default function StaffSelector({
  staffList,
  selectedStaff,
  setSelectedStaff,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = staffList.find(s => s._id === selectedStaff);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-2xl shadow-sm border border-gray-200/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Preferred Staff
        </h2>
        <span className="text-xs text-gray-400 ml-auto">Optional</span>
      </div>

      {/* Custom Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-between hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 group"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
              <User className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
            </div>
            <span className={`text-sm ${!selected ? "text-gray-500" : "text-gray-800 font-medium"}`}>
              {selected ? `${selected.name} · ${selected.role}` : "No Preference (Auto Assign)"}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedStaff("");
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 ${!selectedStaff ? "bg-blue-50/50" : ""}`}
                >
                  <div className="w-5">{!selectedStaff && <Check className="w-4 h-4 text-blue-500" />}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">No Preference</p>
                    <p className="text-xs text-gray-400">Auto assign available staff</p>
                  </div>
                </button>

                {staffList.map((staff) => (
                  <button
                    key={staff._id}
                    onClick={() => {
                      setSelectedStaff(staff._id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${selectedStaff === staff._id ? "bg-blue-50/50" : ""}`}
                  >
                    <div className="w-5">{selectedStaff === staff._id && <Check className="w-4 h-4 text-blue-500" />}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{staff.name}</p>
                      <p className="text-xs text-gray-400">{staff.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-blue-400" />
        Auto-assign picks best available staff
      </p>
    </div>
  );
}