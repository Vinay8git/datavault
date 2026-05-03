import { motion } from "framer-motion";
import { SiGoogledocs } from "react-icons/si";
import { IoImages } from "react-icons/io5";
import { RiFileVideoFill } from "react-icons/ri";
import { FaFileCircleQuestion } from "react-icons/fa6";
import FileOptions from "./FileOptions";

const Card = ({ type, title, size, timeStamp }) => {
  let logo = <FaFileCircleQuestion className="h-8 w-8 text-sky-300" />;

  if (type === "document") logo = <SiGoogledocs className="h-8 w-8 text-blue-300" />;
  else if (type === "image") logo = <IoImages className="h-8 w-8 text-cyan-300" />;
  else if (type === "media") logo = <RiFileVideoFill className="h-8 w-8 text-violet-300" />;

  return (
    <motion.article
      className="rounded-2xl border border-slate-300/20 bg-slate-900/45 p-3 shadow-xl shadow-slate-950/25"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex rounded-xl border border-blue-200/20 bg-white/5 p-3">{logo}</div>
        <div className="shrink-0">
          <FileOptions />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="truncate text-sm font-semibold text-slate-100">{title}</h3>
        <p className="mt-1 text-xs text-blue-200/70">{timeStamp}</p>
      </div>

      <div className="mt-3 inline-flex rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-blue-100">
        {size}
      </div>
    </motion.article>
  );
};

export default Card;