import { useState, useEffect } from "react";
const Home = () => {
  return (
    <div className="bg-black text-[#006A67]">
      <div className="p-10 min-h-30 ">
        <div className=" h-10 max-w-full rounded-full flex justify-between min-w-[600px]">
          <span className="font-bold tracking-[1px] text-[#006A67] text-2xl ml-10 align-bottom flex flex-col h-9 justify-center">
            ChatGpt
          </span>

          <div className="flex mr-10 mt-2">
            <div className="mr-3 max-w-20">SignUp</div>
            <div className="w-15">Prof Pic</div>
          </div>
        </div>
      </div>
      <main className="h-screen bg-black"></main>
      <div className="fixed flex justify-center left-2/6 right-2/6 top-5/6">
        <div className="h-25 flex flex-col p-2  bg-black min-w-[500px] md:max-w-[700px] rounded-4xl flex flex-wrap">
          <textarea
            type="text"
            placeholder="Search"
            onChange={(e) => {
              let Eurl = e.target.value.trim();
              console.log(url + "22");
              if (Eurl) {
                setUrl(Eurl);
              }
            }}
            className="outline-none mt-1 whitespace-normal rounded-4xl w-[400px] p-5 max-h-30   resize-none custom-scrollbar"
          />
          <div
            type="button"
            onClick={() => {
              fetch();
            }}
            className="cursor-pointer mt-6 hover:bg-[#006A67] hover:text-black hover:border-2 hover:border-[#006A67] border-2 rounded-full w-8 h-8 flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5  "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
