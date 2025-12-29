import { useRef } from "react";
import { Button } from "./buttons";

export default function PageTabs({ tabs = [], activeTab, onChange }) {
  const tabRefs = useRef([]);

  const handleKeyDown = (event, tabId, index) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange(tabId);
    } else if (event.key === "ArrowRight" && index < tabs.length - 1) {
      tabRefs.current[index + 1].focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      tabRefs.current[index - 1].focus();
    }
  };

  return (
    <div
      role="tablist"
      className="w-full flex items-center justify-start gap-1 md:gap-2 overflow-x-auto"
    >
      {tabs.map((tab, index) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.to ? "active" : "inactive"}
          to={`${tab.to}`}
          onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          ref={(el) => (tabRefs.current[index] = el)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}