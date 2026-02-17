"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/connection/socket";
import { JobData } from "@/interfaces/interface";
import { addJob } from "@/store/jobStore/jobStore";
import { AppDispatch } from "@/store/store";

export default function PostMain() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleNewJobReq = (job: JobData) => {
      dispatch(addJob(job));
    };

    socket.on("newJob", handleNewJobReq);
    socket.on("jobUpdated", handleNewJobReq);
    socket.on("jobDeleted", handleNewJobReq);

    return () => {
      socket.off("newJob", handleNewJobReq);
      socket.off("jobUpdated", handleNewJobReq);
      socket.off("jobDeleted", handleNewJobReq);
    };
  }, [dispatch]); // ✅ prevent infinite re-subscription

  return (
    <main className="w-full p-5">
      <div className="w-full md:w-[80%]">
        <form className="grid gap-8">
          <div className="job_info">
            <div className="job_head">
              <h3 className="font-bold text-[16px]">JOB INFORMATION</h3>
            </div>

            <div className="post_inp mt-4 grid md:grid-cols-2 gap-3">
              <Input label="Title" placeholder="Title" />
              <Input label="Salary range" placeholder="Input" />
              <Input label="Job type" placeholder="Job type" />
              <Input label="Requirements" placeholder="Input" />
            </div>
          </div>

          <div className="job_info">
            <div className="job_head">
              <h3 className="font-bold text-[16px]">COMPANY INFO</h3>
            </div>

            <div className="post_inp mt-4 grid md:grid-cols-2 gap-3">
              <Input label="Company" placeholder="Company name" />
              <Select label="Location" />
              <Select label="City" />
            </div>
          </div>

          <div className="job_info">
            <div className="job_head">
              <h3 className="font-bold text-[16px]">JOB DESCRIPTION</h3>
            </div>

            <div className="post_inp mt-4">
              <div className="post_ctrl grid gap-1">
                <label className="font-semibold text-[14px]">
                  Job description
                </label>
                <textarea className="w-full h-[200px] border border-shadow outline-none rounded-md px-3" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function Input({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="post_ctrl grid gap-1">
      <label className="font-semibold text-[14px]">{label}</label>
      <input
        className="w-full h-[40px] border border-shadow outline-none rounded-md px-3"
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
}

function Select({ label }: { label: string }) {
  return (
    <div className="post_ctrl grid gap-1">
      <label className="font-semibold text-[14px]">{label}</label>
      <select className="w-full h-[40px] border border-shadow outline-none rounded-md px-3">
        <option value=""></option>
      </select>
    </div>
  );
}
