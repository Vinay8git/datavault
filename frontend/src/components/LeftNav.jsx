import { RiLayout2Fill } from "react-icons/ri";
import { IoDocumentSharp } from "react-icons/io5";
import { FaImages, FaVideo } from "react-icons/fa6";
import { AiFillPieChart } from "react-icons/ai";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: RiLayout2Fill },
  { id: "document", label: "Documents", icon: IoDocumentSharp },
  { id: "image", label: "Images", icon: FaImages },
  { id: "media", label: "Media", icon: FaVideo },
  { id: "other", label: "Others", icon: AiFillPieChart },
];

const LeftNav = ({ changeTab, activeTab }) => {
  return (
    <aside className="dv-glass h-fit rounded-2xl p-3 lg:sticky lg:top-[108px]">
      <div className="mb-2 px-2 pt-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200/70">
        Workspace
      </div>

      <div className="flex flex-row flex-wrap gap-2 lg:flex-col">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => changeTab(id)}
              className={[
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-blue-100/85 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <Icon className={isActive ? "text-white" : "text-blue-200/80 group-hover:text-white"} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default LeftNav;