import React from "react";

function Footer() {
  return (
    <div className="flex flex-col gap-8">
        <div className='w-full border mt-8'></div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-4xl font-bold">Details:</h1>
      </div>
      <p className="text-lg text-[#6F7177] leading-8 md:w-3/4 w-full flex items-center gap-1">
        <img src="link.svg" alt="" className="h-5 rounded-md" /> gitHub :{" "}
        <a
          target="blank"
          href="https://github.com/panugothrakesh/catalog_assignment"
          className="ml-3 hover:underline hover: underline-offset-2 hover:text-[#4B40EE] duration-300 transition-all"
        >
          https://github.com/panugothrakesh/catalog_assignment
        </a>
      </p>
      <p className="text-lg text-[#6F7177] leading-8 md:w-3/4 w-full flex items-center gap-1">
        <img src="link.svg" alt="" className="h-5 rounded-md" /> Rechart :{" "}
        <a target="blank" href="https://recharts.org" className="ml-3 hover:underline hover: underline-offset-2 hover:text-[#4B40EE] duration-300 transition-all">
          https://recharts.org
        </a>
      </p>
      <p className="text-lg text-[#6F7177] leading-8 md:w-3/4 w-full">
        ChatGPT :
        <span className="ml-3">
            Used ChatGpt extensively to get the API and also the Chart
        Data to connect.
        </span>
      </p>
      <div className="w-full border mt-8"></div>
    </div>
  );
}

export default Footer;
