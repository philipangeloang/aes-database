import React from "react";
import { FaHtml5, FaCss3Alt, FaReact } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { SiNextdotjs, SiMongodb } from "react-icons/si";

const TechCarousel = () => {
  return (
    <section className="bg-white dark:bg-gray-900 pt-[5.5rem]">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto justify-center items-center lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 dark:text-[#f1f1f1]">
        <div className="col-span-2 mx-auto">
          <FaHtml5 size="50" />
        </div>
        <div className="col-span-2 mx-auto">
          <FaCss3Alt size="50" />
        </div>
        <div className="col-span-2 mx-auto">
          <IoLogoJavascript size="50" />
        </div>
        <div className="col-span-2 mx-auto">
          <SiNextdotjs size="50" />
        </div>
        <div className="col-span-2 mx-auto">
          <FaReact size="50" />
        </div>
        <div className="col-span-2 mx-auto">
          <SiMongodb size="50" />
        </div>
      </div>
    </section>
  );
};

export default TechCarousel;
